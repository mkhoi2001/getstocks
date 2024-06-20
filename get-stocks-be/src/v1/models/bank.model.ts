export type Bank = {
  id: string
  bankName: string
  cardNumber: string
  username: string
  host?: string
  isActive: boolean
  bankcode?: string
  createdAt: Date
  updatedAt: Date
}

export type BotSmsCb = {
  id: any
  name_bank: any
  money: any
  id_khach: any
  name_khach: any
  sdt_khach: any
  ma_gd: any
  content_bank: any
  trans_id: any
  time_bank: any
  time_callback: any
}

// export type BotSms = {
//   so_tien: number
//   ten_bank: string | null
//   id_khach: string | null
//   ten_khach: string | null
//   sdt_khach: string | null | number
//   ma_gd: any
//   noi_dung: any
//   soDu_bank: any
//   thoi_gian: any
//   trans_id: any
//   ma_baoMat: any
// }
