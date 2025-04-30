export interface BookmarkModel {
  id?: number;
  image_url?: number;
  image_id: number;
  url: string;
  title: string;
  folder_id: number;
  chip_id: number;
  user_id: number;
  date?: Date;
  isdeleted?: boolean;
  click_date?: Date | null;
  created_by?: string;
  updated_by?: string;
}
