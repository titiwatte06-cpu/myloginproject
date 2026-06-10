import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import connectDB from '../mongodb/connectDB.js';
import User from '../data/user.model.js';
import Property from '../data/property.model.js';

const sampleProperties = [
    {
        title: 'Sathorn Glass House',
        description: 'บ้านเดี่ยวสไตล์โมเดิร์น กระจกรอบด้าน พื้นที่ใช้สอยกว้างขวาง เหมาะกับครอบครัวใหญ่',
        price: 18500000,
        area: 320,
        propertyType: 'House',
        bedrooms: 4,
        bathrooms: 4,
        location: { address: '', district: 'Sathorn', province: 'Bangkok', zipcode: '' },
        images: [{ url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80', alt: 'Sathorn Glass House' }],
        isFeatured: true
    },
    {
        title: 'Ari Sky Residence',
        description: 'คอนโดวิวเมือง ใกล้ BTS อารีย์ ตกแต่งพร้อมอยู่ ส่วนกลางครบครัน',
        price: 6200000,
        area: 68,
        propertyType: 'Condo',
        bedrooms: 2,
        bathrooms: 2,
        location: { address: '', district: 'Ari', province: 'Bangkok', zipcode: '' },
        images: [{ url: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80', alt: 'Ari Sky Residence' }],
        isFeatured: true
    },
    {
        title: 'Rama 9 Urban Town',
        description: 'ทาวน์เฮาส์ 3 ชั้น ใกล้รถไฟฟ้าสายสีส้ม ตกแต่งสไตล์มินิมอล',
        price: 7900000,
        area: 185,
        propertyType: 'Townhouse',
        bedrooms: 3,
        bathrooms: 3,
        location: { address: '', district: 'Rama 9', province: 'Bangkok', zipcode: '' },
        images: [{ url: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80', alt: 'Rama 9 Urban Town' }],
        isFeatured: true
    },
    {
        title: 'Thonglor Calm Condo',
        description: 'คอนโดใจกลางทองหล่อ บรรยากาศเงียบสงบ เดินทางสะดวก',
        price: 9300000,
        area: 82,
        propertyType: 'Condo',
        bedrooms: 2,
        bathrooms: 2,
        location: { address: '', district: 'Thonglor', province: 'Bangkok', zipcode: '' },
        images: [{ url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80', alt: 'Thonglor Calm Condo' }]
    },
    {
        title: 'Bangna Courtyard Home',
        description: 'บ้านเดี่ยวพื้นที่กว้าง มีสนามหญ้าและคอร์ทยาร์ดส่วนตัว',
        price: 12800000,
        area: 290,
        propertyType: 'House',
        bedrooms: 4,
        bathrooms: 3,
        location: { address: '', district: 'Bangna', province: 'Bangkok', zipcode: '' },
        images: [{ url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80', alt: 'Bangna Courtyard Home' }]
    },
    {
        title: 'Ladprao Family Townhome',
        description: 'ทาวน์โฮมพร้อมอยู่ ฟังก์ชันครบ จอดรถสะดวก เหมาะกับครอบครัวเริ่มต้น',
        price: 5400000,
        area: 150,
        propertyType: 'Townhouse',
        bedrooms: 3,
        bathrooms: 2,
        location: { address: '', district: 'Ladprao', province: 'Bangkok', zipcode: '' },
        images: [{ url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80', alt: 'Ladprao Family Townhome' }]
    }
];

async function getOrCreateSeedOwner() {
    let owner = await User.findOne();
    if (owner) return owner;

    const passwordHashed = await bcrypt.hash('Seed1234!', await bcrypt.genSalt());
    owner = new User({
        email: 'seed-owner@example.com',
        password: passwordHashed,
        name: 'Demo Owner',
        username: 'seed-owner'
    });
    await owner.save();
    console.log('No users found, created demo owner: seed-owner@example.com');
    return owner;
}

async function seed() {
    await connectDB();

    const owner = await getOrCreateSeedOwner();

    const docs = sampleProperties.map((property) => ({
        ...property,
        ownerId: owner._id,
        ownerName: owner.name || owner.username,
        ownerEmail: owner.email
    }));

    await Property.insertMany(docs);
    console.log(`Inserted ${docs.length} sample properties owned by ${owner.email}`);

    await mongoose.disconnect();
}

seed().catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
});
