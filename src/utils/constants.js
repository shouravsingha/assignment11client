// District and Upazila data structure
export const bangladeshData = {
    districts: [
        { id: 1, name: 'Dhaka' },
        { id: 2, name: 'Chittagong' },
        { id: 3, name: 'Khulna' },
        { id: 4, name: 'Rajshahi' },
        { id: 5, name: 'Barisal' },
        { id: 6, name: 'Sylhet' },
        { id: 7, name: 'Rangpur' },
        { id: 8, name: 'Mymensingh' }
    ],
    upazilas: {
        1: [ // Dhaka
            'Dhaka Sadar',
            'Adabor',
            'Badalonpur',
            'Banani',
            'Bashundhara',
            'Dakshin Khan',
            'Gulshan',
            'Motijheel',
            'Ramna',
            'Rampura',
            'Tejgaon',
            'Tejtutunga'
        ],
        2: [ // Chittagong
            'Chittagong Sadar',
            'Anwara',
            'Banshkhali',
            'Boalkhali',
            'Chandanaish',
            'Fatikchhari',
            'Hathazari',
            'Kotwali',
            'Lohagara',
            'Miersarai',
            'Patenga',
            'Rangunia'
        ],
        3: [ // Khulna
            'Khulna Sadar',
            'Bagerhat',
            'Chuadanga',
            'Jessore',
            'Jhenaidah',
            'Khulna Sadar',
            'Magura',
            'Narail'
        ],
        4: [ // Rajshahi
            'Rajshahi Sadar',
            'Bagha',
            'Charghat',
            'Durgapur',
            'Godagari',
            'Mohanpur',
            'Paba',
            'Tanore'
        ],
        5: [ // Barisal
            'Barisal Sadar',
            'Bakerganj',
            'Barisal',
            'Bhola',
            'Jhalokati',
            'Pirojpur'
        ],
        6: [ // Sylhet
            'Sylhet Sadar',
            'Beanibazar',
            'Companiganj',
            'Fenchuganj',
            'Golapganj',
            'Jaintiapur',
            'Kanaighat',
            'Sunamganj'
        ],
        7: [ // Rangpur
            'Rangpur Sadar',
            'Badarganj',
            'Dinajpur',
            'Gaibandha',
            'Kurigram',
            'Lalmonirhat',
            'Nilphamari',
            'Thakurgaon'
        ],
        8: [ // Mymensingh
            'Mymensingh Sadar',
            'Bhaluka',
            'Dhobaura',
            'Fulbaria',
            'Gaffargaon',
            'Gouripur',
            'Haluaghat',
            'Ismail Sinwar',
            'Jamalpur',
            'Mukundpur'
        ]
    }
}

export const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']

export const donationStatuses = [
    { value: 'pending', label: 'Pending' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
    { value: 'canceled', label: 'Canceled' }
]

export const getDistrictName = (districtId) => {
    const district = bangladeshData.districts.find((item) => {
        return String(item.id) === String(districtId)
    })

    return district?.name || districtId || 'N/A'
}

export const getUpazilasByDistrict = (districtId) => {
    if (!districtId) return []
    return bangladeshData.upazilas[districtId] || []
}
