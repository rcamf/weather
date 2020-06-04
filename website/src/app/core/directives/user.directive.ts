export interface ActiveUser {
  token?: string
  username: string
  name: string
  surname: string
  email: string
  public: boolean
  followers: number
  following: number
}