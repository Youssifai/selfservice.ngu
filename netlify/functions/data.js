// Shared hardcoded data for all API endpoints

const users = {
    'youssef.aly.2023': {
        id: 1,
        username: 'youssef.aly.2023',
        password: 'Sophy2005',
        student: {
            id: 1,
            name: 'Youssef Aly',
            degree: 'Medicine',
            curriculum: 'Bachelor of Medicine and Surgery',
            peopleId: '202300202'
        }
    },
    'tarnim.ahmed.2023': {
        id: 2,
        username: 'tarnim.ahmed.2023',
        password: 'Radwan23',
        student: {
            id: 2,
            name: 'Tarnim Ahmed',
            degree: 'Medicine',
            curriculum: 'Bachelor of Medicine and Surgery',
            peopleId: '202300014'
        }
    }
};

const gradeData = {
    1: { // Youssef Aly
        '2024': {
            'SEM1': {
                courses: [
                    { session: '01', course: 'VM 1.1 MDL', name: 'Vertical Module', section: '01', credits: '3.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'BS 1.1.3 MDL', name: 'Behavioural Sciences', section: '01', credits: '5.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'ID 1.1.2 MDL', name: 'Infection & Defense', section: '01', credits: '9.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'IM 1.1.1 MDL', name: 'Introductory Module', section: '01', credits: '12.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '113.14',
                    'OSPE': '136.50'
                }
            },
            'SEM2': {
                courses: [
                    { session: '01', course: 'VM 1.2 MDL', name: 'Vertical Module', section: '01', credits: '2.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'FNM 1.2.2 MDL', name: 'Fluids, Nutrition & Metabolism', section: '01', credits: '12.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'CB 1.2.1 MDL', name: 'Circulation & Breathing', section: '01', credits: '13.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '213.89',
                    'OSPE': '236.83',
                    'SBA Total': '327.03',
                    'OSPE Total': '373.33',
                    'Total Percentage': '62.53',
                    'Pass/Fail': 'Pass'
                }
            }
        },
        '2025': {
            'SEM1': {
                courses: [
                    { session: '01', course: 'VM 2.1 MDL', name: 'Vertical Module', section: '01', credits: '2.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'ESR 2.1.2 MDL', name: 'Endocrine System & Reproduction', section: '01', credits: '12.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'MMB. 2.1.1 MDL', name: 'Movement & Musculoskeletal Biology', section: '01', credits: '12.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '112',
                    'OSPE': '128'
                }
            }
        }
    },
    2: { // Tarnim Ahmed
        '2024': {
            'SEM1': {
                courses: [
                    { session: '01', course: 'VM 1.1 MDL', name: 'Vertical Module', section: '01', credits: '3.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'BS 1.1.3 MDL', name: 'Behavioural Sciences', section: '01', credits: '5.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'ID 1.1.2 MDL', name: 'Infection & Defense', section: '01', credits: '9.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'IM 1.1.1 MDL', name: 'Introductory Module', section: '01', credits: '12.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '102.86',
                    'OSPE': '138.60'
                }
            },
            'SEM2': {
                courses: [
                    { session: '01', course: 'VM 1.2 MDL', name: 'Vertical Module', section: '01', credits: '2.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'FNM 1.2.2 MDL', name: 'Fluids, Nutrition & Metabolism', section: '01', credits: '12.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'CB 1.2.1 MDL', name: 'Circulation & Breathing', section: '01', credits: '13.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '192.62',
                    'OSPE': '238.47',
                    'SBA Total': '295.48',
                    'OSPE Total': '377.07',
                    'Total Percentage': '60.05',
                    'Pass/Fail': 'Pass'
                }
            }
        },
        '2025': {
            'SEM1': {
                courses: [
                    { session: '01', course: 'VM 2.1 MDL', name: 'Vertical Module', section: '01', credits: '2.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'ESR 2.1.2 MDL', name: 'Endocrine System & Reproduction', section: '01', credits: '12.000', qualityPoints: '0.0000' },
                    { session: '01', course: 'MMB. 2.1.1 MDL', name: 'Movement & Musculoskeletal Biology', section: '01', credits: '12.000', qualityPoints: '0.0000' }
                ],
                finalGrades: {
                    'SBA': '114',
                    'OSPE': '128'
                }
            }
        }
    }
};

module.exports = { users, gradeData };
