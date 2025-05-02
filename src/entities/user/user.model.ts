export interface UserModel {
  id?: string;
  username: string;
  email: string;
  password: string;
  image_id: number;
  role: string;
  isdeleted: boolean;
  updated_by?: string;
  created_by?: string;
  updated_at?: string;
  created_at?: string;
}
