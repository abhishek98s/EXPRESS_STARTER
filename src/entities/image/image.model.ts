export interface ImageModel {
  id?: number;
  name: string;
  url: string;
  type: 'folder' | 'user' | 'bookmark';
  isdeleted: boolean;
  created_by?: string;
  updated_by?: string;
}
