export const properties = [
  {
    id: 1,
    title: 'Sathorn Glass House',
    type: 'บ้านเดี่ยว',
    price: 18500000,
    location: 'Sathorn, Bangkok',
    beds: 4,
    baths: 4,
    area: 320,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 2,
    title: 'Ari Sky Residence',
    type: 'คอนโด',
    price: 6200000,
    location: 'Ari, Bangkok',
    beds: 2,
    baths: 2,
    area: 68,
    image: 'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 3,
    title: 'Rama 9 Urban Town',
    type: 'ทาวน์เฮาส์',
    price: 7900000,
    location: 'Rama 9, Bangkok',
    beds: 3,
    baths: 3,
    area: 185,
    image: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 4,
    title: 'Thonglor Calm Condo',
    type: 'คอนโด',
    price: 9300000,
    location: 'Thonglor, Bangkok',
    beds: 2,
    baths: 2,
    area: 82,
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 5,
    title: 'Bangna Courtyard Home',
    type: 'บ้านเดี่ยว',
    price: 12800000,
    location: 'Bangna, Bangkok',
    beds: 4,
    baths: 3,
    area: 290,
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80'
  },
  {
    id: 6,
    title: 'Ladprao Family Townhome',
    type: 'ทาวน์เฮาส์',
    price: 5400000,
    location: 'Ladprao, Bangkok',
    beds: 3,
    baths: 2,
    area: 150,
    image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80'
  }
]

export const initialReviews = [
  {
    id: 1,
    name: 'Narin S.',
    property: 'Sathorn Glass House',
    rating: 5,
    text: 'พื้นที่เงียบและแปลนบ้านดีมาก เหมาะกับครอบครัวที่อยากอยู่กลางเมืองแต่ยังมีความเป็นส่วนตัว'
  },
  {
    id: 2,
    name: 'Mali K.',
    property: 'Ari Sky Residence',
    rating: 4,
    text: 'เดินทางสะดวก ห้องรับแสงสวย และส่วนกลางดูแลดี ราคาเหมาะกับทำเล'
  },
  {
    id: 3,
    name: 'Pawat R.',
    property: 'Ladprao Family Townhome',
    rating: 4,
    text: 'บ้านพร้อมอยู่ ฟังก์ชันครบ จอดรถได้สบาย เหมาะกับคนเริ่มสร้างครอบครัว'
  }
]

export function formatPrice(price) {
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    maximumFractionDigits: 0
  }).format(price)
}
