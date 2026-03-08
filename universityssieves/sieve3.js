require('dotenv').config();
const axios = require('axios');

const geminiocr = async (files) => {
    const results = {};

    const prompts = {
        uni_birthcert: `Kenyan birth certificate. Extract ONLY JSON. fullname = THE CHILD'S NAME not parents. entry_no, sex, father_name, mother_name, province, confidence`,
        uni_nationalidfile: `Kenyan National ID card. Extract ONLY JSON: fullname, ID_number, sex, place_of_birth, confidence(high/medium/low)`,
        uni_transcript: `Kenyan university transcript/result slip. Extract ONLY JSON: fullname, school, GPA, confidence(high/medium/low)`,
        uni_admission: `Kenyan university admission letter. Extract ONLY JSON: fullname, admission_no, school, course, confidence(high/medium/low)`,
        uni_kcse: `Kenyan KCSE certificate. Extract ONLY JSON: fullname, index_number, school, english, kiswahili, mathematics, exam_year, mean_grade, confidence(high/medium/low)`,
        uni_fee: `Kenyan university fee statement. Extract ONLY JSON: fullname, admission_no, institution, fee_balance, confidence(high/medium/low)`,
        uni_kcpe: `Kenyan KCPE certificate. Extract ONLY JSON: fullname, index_number, school, english, kiswahili, mathematics, science, social_studies, exam_year, confidence(high/medium/low)`,
        uni_income_proof: `Kenyan proof of income. Look for keywords: poor, needy, low income, unemployed, casual labourer, subsistence farmer. Extract ONLY JSON: fullname, income_amount, keywords_found[], issued_by, confidence(high/medium/low)`
    };

    for (const fieldname of Object.keys(files)) {
        const file = files[fieldname][0];
        const base64image = file.buffer.toString('base64');
        const mimeType = file.mimetype;

        try {
            const response = await axios.post('https://api.groq.com/openai/v1/chat/completions', {
                model: 'meta-llama/llama-4-scout-17b-16e-instruct',
                messages: [{
                    role: 'user',
                    content: [
                        { type: 'text', text: prompts[fieldname] },
                        { type: 'image_url', image_url: { url: `data:${mimeType};base64,${base64image}` } }
                    ]
                }],
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENROUTERAPI}`,

                    'Content-Type': 'application/json',
                },
                timeout: 30000,
                maxBodyLength: Infinity,
                maxContentLength: Infinity,
            });
            console.log('GROQ RESPONSE:', JSON.stringify(response.data, null, 2));

            const raw = response.data.choices[0]?.message?.content;
            if (!raw) throw new Error('Empty response from Groq');
            const cleaned = raw
                .replace(/```json/g, '')
                .replace(/```/g, '')
                .replace(/\/\/.*$/gm, '')
                .trim();

            const match = cleaned.match(/\{[\s\S]*?\}/);
            if (!match) throw new Error('No JSON found');
            results[fieldname] = JSON.parse(match[0]);

        } catch (err) {
            console.error(`Failed ${fieldname}:`, err.response?.data || err.message);
            results[fieldname] = { error: true, reason: err.message };
        }
    }

    return results;
};

module.exports = geminiocr;