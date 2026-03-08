
const sharp = require('sharp');


// const documentratio={
//     sec_birthcertfile: { ratio: 1.414, tolerance: 0.50, minSize: 15000, name: 'Birth Certificate' },
//     sec_admission:     { ratio: 1.414, tolerance: 0.50, minSize: 15000, name: 'Admission Letter' },
//     sec_fee:           { ratio: 1.414, tolerance: 0.50, minSize: 15000, name: 'Fee Statement' },
//     sec_death:         { ratio: 1.414, tolerance: 0.50, minSize: 15000, name: 'Death Certificate' },
//     sec_kcse:          { ratio: 1.414, tolerance: 0.50, minSize: 15000, name: 'KCPE Certificate' },
//     sec_results:       { ratio: 1.414, tolerance: 0.50, minSize: 15000, name: 'Result Slip' },
//     sec_income_proof:  { ratio: 1.414, tolerance: 0.50, minSize: 15000, name: 'Income Proof' },

// }

const documentratio = {
    uni_birthcert: { ratio: 1.414, tolerance: 2.0, minSize: 1, name: 'Birth Certificate' },
    uni_nationalidfile: { ratio: 1.414, tolerance: 2.0, minSize: 1, name: 'National Id' },
    uni_admission: { ratio: 1.414, tolerance: 2.0, minSize: 1, name: 'uniVersity admission' },
    uni_transcript: { ratio: 1.414, tolerance: 2.0, minSize: 1, name: 'transcript' },
    uni_kcse: { ratio: 1.414, tolerance: 2.0, minSize: 1, name: 'kcse results' },
    uni_fee: { ratio: 1.414, tolerance: 2.0, minSize: 1, name: ' fee statement' },
    uni_income_proof: { ratio: 1.414, tolerance: 2.0, minSize: 1, name: 'income_proof' },
}
const sieve4 = async (files) => {
    const flags = [];

    for (const fieldname of Object.keys(files)) {
        const file = files[fieldname][0];
        const spec = documentratio[fieldname];

        if (!spec) continue;

        try {
            const metadata = await sharp(file.buffer).metadata();
            const { width, height } = metadata;
            const ratio = width / height;


            if (width < 400 || height < 400) {
                flags.push({
                    field: fieldname,
                    reason: `${spec.name} resolution too low — may be downloaded not photographed`
                });
                continue;
            }


            if (file.size < spec.minSize) {
                flags.push({
                    field: fieldname,
                    reason: `${spec.name} file size too small — may be downloaded`
                });
            }


            const actualRatio = ratio < 1 ? 1 / ratio : ratio;
            const ratioDiff = Math.abs(actualRatio - spec.ratio);

            if (ratioDiff > spec.tolerance) {
                flags.push({
                    field: fieldname,
                    reason: `${spec.name} dimensions suspicious — expected ratio ${spec.ratio} got ${actualRatio.toFixed(3)}`
                });
            }

        } catch (error) {
            flags.push({
                field: fieldname,
                reason: `Could not process ${spec.name} image`
            });
        }



    }
    return flags;
}
module.exports = sieve4