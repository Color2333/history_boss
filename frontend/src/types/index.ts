export interface PersonBasicInfo {
  personid: number;
  name: string;
  name_chn: string;
  dynasty: string;
  dynasty_id: number;
  gender: string;
  birth_year: number | null;
  death_year: number | null;
  death_age: number | null;
  index_year: number | null;
  surname: string;
  mingzi: string;
  notes?: string;
}

export interface AltName {
  alt_name: string;
  alt_name_chn: string;
  type: string;
  type_code: number;
}

export interface KinRelation {
  kin_id: number;
  kin_name: string;
  relation: string;
  relation_code: number;
}

export interface SocialRelation {
  assoc_id: number;
  assoc_name: string;
  relation: string;
  relation_code: number;
  year: number | null;
}

export interface Address {
  addr_id: number;
  addr_name: string;
  addr_type: string;
  addr_type_code: number;
  first_year: number | null;
  last_year: number | null;
}

export interface Office {
  office_id: number;
  office_name: string;
  first_year: number | null;
  last_year: number | null;
  appointment_type: string;
  assume_office: string;
}

export interface Entry {
  entry_code: number;
  entry_desc: string;
  year: number | null;
  age: number | null;
  attempt_count: number | null;
  exam_rank: number | null;
}

export interface Status {
  status_code: number;
  status_desc: string;
  first_year: number | null;
  last_year: number | null;
  supplement: string | null;
}

export interface Text {
  text_id: number;
  title: string;
  role: string;
  year: number | null;
}

export interface Person {
  basic_info: PersonBasicInfo;
  alt_names: AltName[];
  kin_relations: KinRelation[];
  social_relations: SocialRelation[];
  addresses: Address[];
  offices: Office[];
  entries: Entry[];
  statuses: Status[];
  texts: Text[];
}

export interface Dynasty {
  dynasty_id: number;
  dynasty: string;
  dynasty_chn: string;
  start_year: number;
  end_year: number;
  sort: number;
}

export interface SearchParams {
  name?: string;
  dynasty_id?: number;
  birth_year_from?: number;
  birth_year_to?: number;
  address_id?: number;
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  total: number;
  offset: number;
  limit: number;
  results: PersonBasicInfo[];
}

export interface ActivityPoint {
  name: string;
  location_name: string;
  relation_type: string;
  first_year: number;
  last_year: number;
  longitude: number;
  latitude: number;
  search_name: string;
} 