require('dotenv').config();
const axios = require('axios');

const geminiocr = async (files) => {
    const results = {};

    const prompts = {
      sec_birthcertfile: `Kenyan birth certificate. Extract ONLY JSON. fullname = THE CHILD'S NAME not parents. entry_no, sex, father_name, mother_name, province, confidence(high/medium/low)`,
        sec_results: `Kenyan KCPE result slip. Extract ONLY JSON: fullname, index_number, school,english,kiswahili,mathematics,science,social_studies, confidence`,
        sec_admission: `Kenyan secondary school admission letter. Extract ONLY JSON: fullname, admission_no, school, form, confidence`,
        sec_fee: `Kenyan school fee statement. Extract ONLY JSON: fullname, admission_no, institution, fee_balance, confidence`,
        sec_death: `Kenyan death certificate. Extract ONLY JSON: deceased_name, death_cert_no, date_of_death(YYYY-MM-DD), confidence`,
        sec_kcpe: `Kenyan KCPE marks certificate. Extract ONLY JSON: fullname, index_number, school, english, kiswahili, mathematics, science, social_studies, exam_year, confidence`,
        sec_income_proof: `Kenyan proof of income. Look for keywords: poor, needy, low income, unemployed, casual labourer, subsistence farmer. Extract ONLY JSON: fullname, income_amount, keywords_found[], issued_by, confidence`,
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