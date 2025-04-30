export interface FolderModel {
  id?: number;
  name: string;
  image_id: number;
  image_url?: number;
  user_id: number;
  folder_id: number | null;
  isdeleted?: boolean;
  created_by?: string;
  updated_by?: string;
}
