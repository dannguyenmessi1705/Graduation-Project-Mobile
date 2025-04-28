export interface UserInfo {
  id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  gender?: string;
  birthDay?: string;
  country?: string;
  city?: string;
  phoneNumber?: string;
  postalCode?: string;
  picture?: string;
}

export interface UserDetails extends UserInfo {
  // Additional user details if needed
}
