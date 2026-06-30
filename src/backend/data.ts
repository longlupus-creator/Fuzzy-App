export type Category = {
  id: string
  name: string
  icon?: string
}

export type Product = {
  id: number
  name: string
  category: string
  color: string
  sizes: string[]
  price: number
  oldPrice: number
  stock: number
  hidden?: boolean
  rating: number
  reviews: number
  image: string
  images: string[]
  description: string
}

export type Address = {
  id: string
  label: string
  name: string
  line: string
  phone: string
  isDefault: boolean
}

export type PaymentCard = {
  id: string
  type: string
  number: string
  holder: string
  expiry: string
}

export const asset = (path: string) => `/fuzzy/assets/images/${path}`

export const categories: Category[] = [
  { id: 'sofa', name: 'Sofa', icon: asset('svg/sofa.svg') },
  { id: 'chair', name: 'Chair' },
  { id: 'table', name: 'Table' },
  { id: 'cabinet', name: 'Cabinet' },
  { id: 'lamp', name: 'Lamp' },
  { id: 'decor', name: 'Decor' },
]

export const products: Product[] = [
  {
    id: 1,
    name: 'Modern Sofa',
    category: 'sofa',
    color: 'Yellow',
    sizes: ['S', 'M', 'L'],
    price: 150,
    oldPrice: 200,
    stock: 12,
    rating: 4.8,
    reviews: 128,
    image: asset('product/1.png'),
    images: [asset('product/1.png'), asset('product/10.png'), asset('product/12.png')],
    description: 'A soft modern sofa with a rounded profile for relaxed living rooms.',
  },
  {
    id: 2,
    name: 'Club Chair',
    category: 'chair',
    color: 'Cream',
    sizes: ['S', 'M'],
    price: 110,
    oldPrice: 140,
    stock: 8,
    rating: 4.6,
    reviews: 96,
    image: asset('product/2.png'),
    images: [asset('product/2.png'), asset('product/3.png'), asset('product/4.png')],
    description: 'Compact lounge chair with supportive padding and a quiet silhouette.',
  },
  {
    id: 7,
    name: 'Side Table',
    category: 'table',
    color: 'Brown',
    sizes: ['One size'],
    price: 50,
    oldPrice: 80,
    stock: 18,
    rating: 4.5,
    reviews: 61,
    image: asset('product/7.png'),
    images: [asset('product/7.png'), asset('product/8.png'), asset('product/9.png')],
    description: 'A warm wooden side table for books, lighting, and small decor.',
  },
  {
    id: 11,
    name: 'Lounge Chair',
    category: 'chair',
    color: 'Blue',
    sizes: ['M', 'L'],
    price: 130,
    oldPrice: 160,
    stock: 9,
    rating: 4.9,
    reviews: 214,
    image: asset('product/11.png'),
    images: [asset('product/11.png'), asset('product/12.png'), asset('product/14.png')],
    description: 'Deep lounge seating with a soft cushion and polished metal frame.',
  },
  {
    id: 13,
    name: 'Hanging Light',
    category: 'lamp',
    color: 'Black',
    sizes: ['One size'],
    price: 30,
    oldPrice: 60,
    stock: 25,
    rating: 4.3,
    reviews: 42,
    image: asset('product/13.png'),
    images: [asset('product/13.png'), asset('product/18.png'), asset('product/19.png')],
    description: 'Minimal pendant light for dining spaces, reading corners, and entryways.',
  },
  {
    id: 16,
    name: 'Cabinet Shelf',
    category: 'cabinet',
    color: 'Walnut',
    sizes: ['M', 'L', 'XL'],
    price: 180,
    oldPrice: 230,
    stock: 7,
    rating: 4.7,
    reviews: 73,
    image: asset('product/16.png'),
    images: [asset('product/16.png'), asset('product/21.png'), asset('product/22.png')],
    description: 'Useful storage with display space for books, vases, and daily essentials.',
  },
]

export const addresses: Address[] = [
  {
    id: 'home',
    label: 'Home',
    name: 'Agasya',
    line: '4517 Washington Ave. Manchester, Kentucky 39495',
    phone: '+1 234 567 8900',
    isDefault: true,
  },
  {
    id: 'office',
    label: 'Office',
    name: 'Agasya',
    line: '2972 Westheimer Rd. Santa Ana, Illinois 85486',
    phone: '+1 234 567 8099',
    isDefault: false,
  },
]

export const paymentCards: PaymentCard[] = [
  { id: 'visa', type: 'Visa', number: '**** **** **** 2563', holder: 'Agasya', expiry: '08/29' },
  { id: 'master', type: 'Mastercard', number: '**** **** **** 4802', holder: 'Agasya', expiry: '11/30' },
]

export const coupons = [
  { id: 'fuzzy20', code: 'FUZZY20', title: '20% off furniture', value: 20 },
  { id: 'ship', code: 'FREESHIP', title: 'Free shipping', value: 12 },
  { id: 'new', code: 'NEW50', title: '$50 off first order', value: 50 },
]

export const notifications = [
  'Your order #1024 is out for delivery.',
  'New relaxing furniture collection is available.',
  'FUZZY20 coupon expires tonight.',
]
