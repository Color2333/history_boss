/*
 Navicat Premium Data Transfer

 Source Server         : data
 Source Server Type    : SQLite
 Source Server Version : 3035005 (3.35.5)
 Source Schema         : main

 Target Server Type    : SQLite
 Target Server Version : 3035005 (3.35.5)
 File Encoding         : 65001

 Date: 11/04/2025 00:30:44
*/

PRAGMA foreign_keys = false;

-- ----------------------------
-- Table structure for ADDRESSES
-- ----------------------------
DROP TABLE IF EXISTS "ADDRESSES";
CREATE TABLE "ADDRESSES" (
  "c_addr_id" INTEGER,
  "c_addr_cbd" CHAR(255),
  "c_name" CHAR(255),
  "c_name_chn" CHAR(255),
  "c_admin_type" CHAR(255),
  "c_firstyear" INTEGER,
  "c_lastyear" INTEGER,
  "x_coord" FLOAT,
  "y_coord" FLOAT,
  "belongs1_ID" INTEGER,
  "belongs1_Name" CHAR(255),
  "belongs2_ID" INTEGER,
  "belongs2_Name" CHAR(255),
  "belongs3_ID" INTEGER,
  "belongs3_Name" CHAR(255),
  "belongs4_ID" INTEGER,
  "belongs4_Name" CHAR(255),
  "belongs5_ID" INTEGER,
  "belongs5_Name" CHAR(255)
);

-- ----------------------------
-- Table structure for ADDR_BELONGS_DATA
-- ----------------------------
DROP TABLE IF EXISTS "ADDR_BELONGS_DATA";
CREATE TABLE "ADDR_BELONGS_DATA" (
  "c_addr_id" INTEGER NOT NULL,
  "c_belongs_to" INTEGER NOT NULL,
  "c_firstyear" INTEGER NOT NULL,
  "c_lastyear" INTEGER NOT NULL,
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_secondary_source_author" CHAR(255),
  "c_notes" CHAR(255)
);

-- ----------------------------
-- Table structure for ADDR_CODES
-- ----------------------------
DROP TABLE IF EXISTS "ADDR_CODES";
CREATE TABLE "ADDR_CODES" (
  "c_addr_id" INTEGER,
  "c_name" CHAR(255),
  "c_name_chn" CHAR(255),
  "c_firstyear" INTEGER,
  "c_lastyear" INTEGER,
  "c_admin_type" CHAR(255),
  "x_coord" FLOAT,
  "y_coord" FLOAT,
  "CHGIS_PT_ID" INTEGER,
  "c_notes" CHAR,
  "c_alt_names" CHAR(255)
);

-- ----------------------------
-- Table structure for ADDR_PLACE_DATA
-- ----------------------------
DROP TABLE IF EXISTS "ADDR_PLACE_DATA";
CREATE TABLE "ADDR_PLACE_DATA" (
  "c_addr_id" INTEGER,
  "c_place_id" INTEGER,
  "c_firstyear" INTEGER,
  "c_lastyear" INTEGER
);

-- ----------------------------
-- Table structure for ADDR_XY
-- ----------------------------
DROP TABLE IF EXISTS "ADDR_XY";
CREATE TABLE "ADDR_XY" (
  "c_addr_id" INTEGER,
  "x_coord" FLOAT,
  "y_coord" FLOAT,
  "c_source_reference" CHAR(255),
  "c_source_id" INTEGER,
  "c_notes" CHAR
);

-- ----------------------------
-- Table structure for ALTNAME_CODES
-- ----------------------------
DROP TABLE IF EXISTS "ALTNAME_CODES";
CREATE TABLE "ALTNAME_CODES" (
  "c_name_type_code" INTEGER,
  "c_name_type_desc" CHAR(255),
  "c_name_type_desc_chn" CHAR(255)
);

-- ----------------------------
-- Table structure for ALTNAME_DATA
-- ----------------------------
DROP TABLE IF EXISTS "ALTNAME_DATA";
CREATE TABLE "ALTNAME_DATA" (
  "c_personid" INTEGER NOT NULL,
  "c_alt_name" CHAR(255),
  "c_alt_name_chn" CHAR(255) NOT NULL,
  "c_alt_name_type_code" INTEGER NOT NULL,
  "c_sequence" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR,
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for APPOINTMENT_TYPE_CODES
-- ----------------------------
DROP TABLE IF EXISTS "APPOINTMENT_TYPE_CODES";
CREATE TABLE "APPOINTMENT_TYPE_CODES" (
  "c_appt_type_code" INTEGER NOT NULL,
  "c_appt_type_desc_chn" CHAR(255),
  "c_appt_type_desc" CHAR(255),
  "c_appt_type_desc_chn_alt" CHAR(255),
  "c_appt_type_desc_alt" CHAR(255),
  "check" INTEGER,
  "c_notes" CHAR(255)
);

-- ----------------------------
-- Table structure for ASSOC_CODES
-- ----------------------------
DROP TABLE IF EXISTS "ASSOC_CODES";
CREATE TABLE "ASSOC_CODES" (
  "c_assoc_code" INTEGER,
  "c_assoc_pair" INTEGER,
  "c_assoc_pair2" INTEGER,
  "c_assoc_desc" CHAR(255),
  "c_assoc_desc_chn" CHAR(255),
  "c_assoc_role_type" CHAR(2),
  "c_sortorder" INTEGER,
  "c_example" CHAR(255)
);

-- ----------------------------
-- Table structure for ASSOC_CODE_TYPE_REL
-- ----------------------------
DROP TABLE IF EXISTS "ASSOC_CODE_TYPE_REL";
CREATE TABLE "ASSOC_CODE_TYPE_REL" (
  "c_assoc_code" INTEGER,
  "c_assoc_type_id" CHAR(255)
);

-- ----------------------------
-- Table structure for ASSOC_DATA
-- ----------------------------
DROP TABLE IF EXISTS "ASSOC_DATA";
CREATE TABLE "ASSOC_DATA" (
  "c_assoc_code" INTEGER NOT NULL,
  "c_personid" INTEGER NOT NULL,
  "c_kin_code" INTEGER NOT NULL,
  "c_kin_id" INTEGER NOT NULL,
  "c_assoc_id" INTEGER NOT NULL,
  "c_assoc_kin_code" INTEGER NOT NULL,
  "c_assoc_kin_id" INTEGER NOT NULL,
  "c_tertiary_personid" INTEGER,
  "c_tertiary_type_notes" CHAR(255),
  "c_assoc_count" INTEGER,
  "c_sequence" INTEGER,
  "c_assoc_year" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR,
  "c_assoc_nh_code" INTEGER,
  "c_assoc_nh_year" INTEGER,
  "c_assoc_range" INTEGER,
  "c_addr_id" INTEGER,
  "c_litgenre_code" INTEGER,
  "c_occasion_code" INTEGER,
  "c_topic_code" INTEGER,
  "c_inst_code" INTEGER,
  "c_inst_name_code" INTEGER,
  "c_text_title" CHAR(255) NOT NULL,
  "c_assoc_claimer_id" INTEGER,
  "c_assoc_intercalary" BOOLEAN(2) NOT NULL,
  "c_assoc_month" INTEGER,
  "c_assoc_day" INTEGER,
  "c_assoc_day_gz" INTEGER,
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for ASSOC_TYPES
-- ----------------------------
DROP TABLE IF EXISTS "ASSOC_TYPES";
CREATE TABLE "ASSOC_TYPES" (
  "c_assoc_type_id" CHAR(255),
  "c_assoc_type_desc" CHAR(255),
  "c_assoc_type_desc_chn" CHAR(255),
  "c_assoc_type_parent_id" CHAR(255),
  "c_assoc_type_level" INTEGER,
  "c_assoc_type_sortorder" INTEGER,
  "c_assoc_type_short_desc" CHAR(50)
);

-- ----------------------------
-- Table structure for ASSUME_OFFICE_CODES
-- ----------------------------
DROP TABLE IF EXISTS "ASSUME_OFFICE_CODES";
CREATE TABLE "ASSUME_OFFICE_CODES" (
  "c_assume_office_code" INTEGER,
  "c_assume_office_desc_chn" CHAR(50),
  "c_assume_office_desc" CHAR(50)
);

-- ----------------------------
-- Table structure for BIOG_ADDR_CODES
-- ----------------------------
DROP TABLE IF EXISTS "BIOG_ADDR_CODES";
CREATE TABLE "BIOG_ADDR_CODES" (
  "c_addr_type" INTEGER NOT NULL,
  "c_addr_desc" CHAR(255),
  "c_addr_desc_chn" CHAR(255),
  "c_addr_note" CHAR(255),
  "c_index_addr_rank" INTEGER,
  "c_index_addr_default_rank" INTEGER
);

-- ----------------------------
-- Table structure for BIOG_ADDR_DATA
-- ----------------------------
DROP TABLE IF EXISTS "BIOG_ADDR_DATA";
CREATE TABLE "BIOG_ADDR_DATA" (
  "c_personid" INTEGER NOT NULL,
  "c_addr_id" INTEGER NOT NULL,
  "c_addr_type" INTEGER NOT NULL,
  "c_sequence" INTEGER NOT NULL,
  "c_firstyear" INTEGER,
  "c_lastyear" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR,
  "c_fy_nh_code" INTEGER,
  "c_ly_nh_code" INTEGER,
  "c_fy_nh_year" INTEGER,
  "c_ly_nh_year" INTEGER,
  "c_fy_range" INTEGER,
  "c_ly_range" INTEGER,
  "c_natal" INTEGER,
  "c_fy_intercalary" BOOLEAN(2) NOT NULL,
  "c_ly_intercalary" BOOLEAN(2) NOT NULL,
  "c_fy_month" INTEGER,
  "c_ly_month" INTEGER,
  "c_fy_day" INTEGER,
  "c_ly_day" INTEGER,
  "c_fy_day_gz" INTEGER,
  "c_ly_day_gz" INTEGER,
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255),
  "c_delete" INTEGER
);

-- ----------------------------
-- Table structure for BIOG_INST_CODES
-- ----------------------------
DROP TABLE IF EXISTS "BIOG_INST_CODES";
CREATE TABLE "BIOG_INST_CODES" (
  "c_bi_role_code" INTEGER,
  "c_bi_role_desc" CHAR(255),
  "c_bi_role_chn" CHAR(255),
  "c_notes" CHAR(255)
);

-- ----------------------------
-- Table structure for BIOG_INST_DATA
-- ----------------------------
DROP TABLE IF EXISTS "BIOG_INST_DATA";
CREATE TABLE "BIOG_INST_DATA" (
  "c_personid" INTEGER NOT NULL,
  "c_inst_name_code" INTEGER NOT NULL,
  "c_inst_code" INTEGER NOT NULL,
  "c_bi_role_code" INTEGER NOT NULL,
  "c_bi_begin_year" INTEGER,
  "c_bi_by_nh_code" INTEGER,
  "c_bi_by_nh_year" INTEGER,
  "c_bi_by_range" INTEGER,
  "c_bi_end_year" INTEGER,
  "c_bi_ey_nh_code" INTEGER,
  "c_bi_ey_nh_year" INTEGER,
  "c_bi_ey_range" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR,
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255),
  "tts_sysno" INTEGER
);

-- ----------------------------
-- Table structure for BIOG_MAIN
-- ----------------------------
DROP TABLE IF EXISTS "BIOG_MAIN";
CREATE TABLE "BIOG_MAIN" (
  "c_personid" INTEGER NOT NULL,
  "c_name" CHAR(255),
  "c_name_chn" CHAR(255),
  "c_index_year" INTEGER,
  "c_index_year_type_code" CHAR(16),
  "c_index_year_source_id" INTEGER,
  "c_female" BOOLEAN(2) NOT NULL,
  "c_index_addr_id" INTEGER,
  "c_index_addr_type_code" INTEGER,
  "c_ethnicity_code" INTEGER,
  "c_household_status_code" INTEGER,
  "c_tribe" CHAR(255),
  "c_birthyear" INTEGER,
  "c_by_nh_code" INTEGER,
  "c_by_nh_year" INTEGER,
  "c_by_range" INTEGER,
  "c_deathyear" INTEGER,
  "c_dy_nh_code" INTEGER,
  "c_dy_nh_year" INTEGER,
  "c_dy_range" INTEGER,
  "c_death_age" INTEGER,
  "c_death_age_range" INTEGER,
  "c_fl_earliest_year" INTEGER,
  "c_fl_ey_nh_code" INTEGER,
  "c_fl_ey_nh_year" INTEGER,
  "c_fl_ey_notes" CHAR,
  "c_fl_latest_year" INTEGER,
  "c_fl_ly_nh_code" INTEGER,
  "c_fl_ly_nh_year" INTEGER,
  "c_fl_ly_notes" CHAR,
  "c_surname" CHAR(255),
  "c_surname_chn" CHAR(255),
  "c_mingzi" CHAR(255),
  "c_mingzi_chn" CHAR(255),
  "c_dy" INTEGER,
  "c_choronym_code" INTEGER,
  "c_notes" CHAR,
  "c_by_intercalary" BOOLEAN(2) NOT NULL,
  "c_dy_intercalary" BOOLEAN(2) NOT NULL,
  "c_by_month" INTEGER,
  "c_dy_month" INTEGER,
  "c_by_day" INTEGER,
  "c_dy_day" INTEGER,
  "c_by_day_gz" INTEGER,
  "c_dy_day_gz" INTEGER,
  "c_surname_proper" CHAR(255),
  "c_mingzi_proper" CHAR(255),
  "c_name_proper" CHAR(255),
  "c_surname_rm" CHAR(255),
  "c_mingzi_rm" CHAR(255),
  "c_name_rm" CHAR(255),
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255),
  "c_self_bio" BOOLEAN(2) NOT NULL
);

-- ----------------------------
-- Table structure for BIOG_SOURCE_DATA
-- ----------------------------
DROP TABLE IF EXISTS "BIOG_SOURCE_DATA";
CREATE TABLE "BIOG_SOURCE_DATA" (
  "c_personid" INTEGER NOT NULL,
  "c_textid" INTEGER NOT NULL,
  "c_pages" CHAR(255) NOT NULL,
  "c_notes" CHAR,
  "c_main_source" BOOLEAN(2) NOT NULL,
  "c_self_bio" BOOLEAN(2) NOT NULL
);

-- ----------------------------
-- Table structure for BIOG_TEXT_DATA
-- ----------------------------
DROP TABLE IF EXISTS "BIOG_TEXT_DATA";
CREATE TABLE "BIOG_TEXT_DATA" (
  "c_textid" INTEGER NOT NULL,
  "c_personid" INTEGER NOT NULL,
  "c_role_id" INTEGER NOT NULL,
  "c_year" INTEGER,
  "c_nh_code" INTEGER,
  "c_nh_year" INTEGER,
  "c_range_code" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR,
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for CBDB_NAME_LIST
-- ----------------------------
DROP TABLE IF EXISTS "CBDB_NAME_LIST";
CREATE TABLE "CBDB_NAME_LIST" (
  "c_personid" INTEGER NOT NULL,
  "name" CHAR(255) NOT NULL,
  "source" CHAR(255) NOT NULL
);

-- ----------------------------
-- Table structure for CHORONYM_CODES
-- ----------------------------
DROP TABLE IF EXISTS "CHORONYM_CODES";
CREATE TABLE "CHORONYM_CODES" (
  "c_choronym_code" INTEGER,
  "c_choronym_desc" CHAR(255),
  "c_choronym_chn" CHAR(255)
);

-- ----------------------------
-- Table structure for COUNTRY_CODES
-- ----------------------------
DROP TABLE IF EXISTS "COUNTRY_CODES";
CREATE TABLE "COUNTRY_CODES" (
  "c_country_code" INTEGER,
  "c_country_desc" CHAR(50),
  "c_country_desc_chn" CHAR(50)
);

-- ----------------------------
-- Table structure for CopyMissingTables
-- ----------------------------
DROP TABLE IF EXISTS "CopyMissingTables";
CREATE TABLE "CopyMissingTables" (
  "ID" INTEGER NOT NULL,
  "TableName" CHAR(255)
);

-- ----------------------------
-- Table structure for CopyTables
-- ----------------------------
DROP TABLE IF EXISTS "CopyTables";
CREATE TABLE "CopyTables" (
  "TableName" CHAR(255) NOT NULL,
  "NotProcessed" BOOLEAN(2) NOT NULL
);

-- ----------------------------
-- Table structure for CopyTablesDefault
-- ----------------------------
DROP TABLE IF EXISTS "CopyTablesDefault";
CREATE TABLE "CopyTablesDefault" (
  "ID" INTEGER NOT NULL,
  "TableName" CHAR(255)
);

-- ----------------------------
-- Table structure for DYNASTIES
-- ----------------------------
DROP TABLE IF EXISTS "DYNASTIES";
CREATE TABLE "DYNASTIES" (
  "c_dy" INTEGER,
  "c_dynasty" CHAR(255),
  "c_dynasty_chn" CHAR(255),
  "c_start" INTEGER,
  "c_end" INTEGER,
  "c_sort" INTEGER
);

-- ----------------------------
-- Table structure for ENTRY_CODES
-- ----------------------------
DROP TABLE IF EXISTS "ENTRY_CODES";
CREATE TABLE "ENTRY_CODES" (
  "c_entry_code" INTEGER,
  "c_entry_desc" CHAR(255),
  "c_entry_desc_chn" CHAR(255)
);

-- ----------------------------
-- Table structure for ENTRY_CODE_TYPE_REL
-- ----------------------------
DROP TABLE IF EXISTS "ENTRY_CODE_TYPE_REL";
CREATE TABLE "ENTRY_CODE_TYPE_REL" (
  "c_entry_code" INTEGER,
  "c_entry_type" CHAR(255)
);

-- ----------------------------
-- Table structure for ENTRY_DATA
-- ----------------------------
DROP TABLE IF EXISTS "ENTRY_DATA";
CREATE TABLE "ENTRY_DATA" (
  "c_personid" INTEGER NOT NULL,
  "c_entry_code" INTEGER NOT NULL,
  "c_sequence" INTEGER NOT NULL,
  "c_exam_rank" CHAR(255),
  "c_kin_code" INTEGER NOT NULL,
  "c_kin_id" INTEGER NOT NULL,
  "c_assoc_code" INTEGER NOT NULL,
  "c_assoc_id" INTEGER NOT NULL,
  "c_year" INTEGER NOT NULL,
  "c_age" INTEGER,
  "c_nianhao_id" INTEGER,
  "c_entry_nh_year" INTEGER,
  "c_entry_range" INTEGER,
  "c_inst_code" INTEGER NOT NULL,
  "c_inst_name_code" INTEGER NOT NULL,
  "c_exam_field" CHAR(255),
  "c_entry_addr_id" INTEGER,
  "c_parental_status" INTEGER,
  "c_attempt_count" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR,
  "c_posting_notes" CHAR(255),
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for ENTRY_TYPES
-- ----------------------------
DROP TABLE IF EXISTS "ENTRY_TYPES";
CREATE TABLE "ENTRY_TYPES" (
  "c_entry_type" CHAR(255),
  "c_entry_type_desc" CHAR(255),
  "c_entry_type_desc_chn" CHAR(255),
  "c_entry_type_parent_id" CHAR(255),
  "c_entry_type_level" FLOAT,
  "c_entry_type_sortorder" FLOAT
);

-- ----------------------------
-- Table structure for ETHNICITY_TRIBE_CODES
-- ----------------------------
DROP TABLE IF EXISTS "ETHNICITY_TRIBE_CODES";
CREATE TABLE "ETHNICITY_TRIBE_CODES" (
  "c_ethnicity_code" INTEGER,
  "c_group_code" INTEGER,
  "c_subgroup_code" INTEGER,
  "c_altname_code" INTEGER,
  "c_name_chn" CHAR(255),
  "c_name" CHAR(255),
  "c_ethno_legal_cat" CHAR(255),
  "c_romanized" CHAR(255),
  "c_surname" CHAR(255),
  "c_notes" CHAR,
  "JiuTangShu" CHAR(255),
  "XinTangShu" CHAR(255),
  "JiuWudaiShi" CHAR(255),
  "XinWudaiShi" CHAR(255),
  "SongShi" CHAR(255),
  "LiaoShi" CHAR(255),
  "JinShi" CHAR(255),
  "YuanShi" CHAR(255),
  "MingShi" CHAR(255),
  "QingShiGao" CHAR(255),
  "c_sortorder" INTEGER
);

-- ----------------------------
-- Table structure for EVENTS_ADDR
-- ----------------------------
DROP TABLE IF EXISTS "EVENTS_ADDR";
CREATE TABLE "EVENTS_ADDR" (
  "c_event_record_id" INTEGER,
  "c_personid" INTEGER,
  "c_addr_id" INTEGER,
  "c_year" INTEGER,
  "c_nh_code" INTEGER,
  "c_nh_year" INTEGER,
  "c_yr_range" INTEGER,
  "c_intercalary" BOOLEAN(2) NOT NULL,
  "c_month" INTEGER,
  "c_day" INTEGER,
  "c_day_ganzhi" INTEGER
);

-- ----------------------------
-- Table structure for EVENTS_DATA
-- ----------------------------
DROP TABLE IF EXISTS "EVENTS_DATA";
CREATE TABLE "EVENTS_DATA" (
  "c_personid" INTEGER,
  "c_sequence" INTEGER,
  "c_event_record_id" INTEGER,
  "c_event_code" INTEGER,
  "c_role" CHAR(255),
  "c_year" INTEGER,
  "c_nh_code" INTEGER,
  "c_nh_year" INTEGER,
  "c_yr_range" INTEGER,
  "c_intercalary" BOOLEAN(2) NOT NULL,
  "c_month" INTEGER,
  "c_day" INTEGER,
  "c_day_ganzhi" INTEGER,
  "c_addr_id" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_event" CHAR,
  "c_notes" CHAR(255),
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for EVENT_CODES
-- ----------------------------
DROP TABLE IF EXISTS "EVENT_CODES";
CREATE TABLE "EVENT_CODES" (
  "c_event_code" INTEGER NOT NULL,
  "c_event_name_chn" CHAR(50),
  "c_event_name" CHAR(50),
  "c_fy_yr" INTEGER,
  "c_ly_yr" INTEGER,
  "c_fy_nh_code" INTEGER,
  "c_ly_nh_code" INTEGER,
  "c_fy_nh_yr" INTEGER,
  "c_ly_nh_yr" INTEGER,
  "c_fy_intercalary" BOOLEAN(2) NOT NULL,
  "c_fy_month" INTEGER,
  "c_ly_intercalary" BOOLEAN(2) NOT NULL,
  "c_ly_month" INTEGER,
  "c_fy_range" INTEGER,
  "c_ly_range" INTEGER,
  "c_addr_id" INTEGER,
  "c_dy" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(50),
  "c_event_notes" CHAR(255)
);

-- ----------------------------
-- Table structure for EXTANT_CODES
-- ----------------------------
DROP TABLE IF EXISTS "EXTANT_CODES";
CREATE TABLE "EXTANT_CODES" (
  "c_extant_code" INTEGER,
  "c_extant_desc" CHAR(50),
  "c_extant_desc_chn" CHAR(50),
  "c_extant_code_hd" CHAR(50)
);

-- ----------------------------
-- Table structure for ForeignKeys
-- ----------------------------
DROP TABLE IF EXISTS "ForeignKeys";
CREATE TABLE "ForeignKeys" (
  "AccessTblNm" CHAR(255),
  "AccessFldNm" CHAR(255),
  "ForeignKey" CHAR(255),
  "ForeignKeyBaseField" CHAR(255),
  "FKString" CHAR(255),
  "FKName" CHAR(255),
  "skip" INTEGER,
  "IndexOnField" CHAR(255),
  "DataFormat" CHAR(255),
  "NULL_allowed" BOOLEAN(2) NOT NULL
);

-- ----------------------------
-- Table structure for FormLabels
-- ----------------------------
DROP TABLE IF EXISTS "FormLabels";
CREATE TABLE "FormLabels" (
  "c_form" CHAR(50),
  "c_label_id" INTEGER,
  "c_english" CHAR(255),
  "c_jianti" CHAR(90),
  "c_fanti" CHAR(90)
);

-- ----------------------------
-- Table structure for GANZHI_CODES
-- ----------------------------
DROP TABLE IF EXISTS "GANZHI_CODES";
CREATE TABLE "GANZHI_CODES" (
  "c_ganzhi_code" INTEGER,
  "c_ganzhi_chn" CHAR(50),
  "c_ganzhi_py" CHAR(50)
);

-- ----------------------------
-- Table structure for HOUSEHOLD_STATUS_CODES
-- ----------------------------
DROP TABLE IF EXISTS "HOUSEHOLD_STATUS_CODES";
CREATE TABLE "HOUSEHOLD_STATUS_CODES" (
  "c_household_status_code" INTEGER,
  "c_household_status_desc" CHAR(255),
  "c_household_status_desc_chn" CHAR(255)
);

-- ----------------------------
-- Table structure for INDEXYEAR_TYPE_CODES
-- ----------------------------
DROP TABLE IF EXISTS "INDEXYEAR_TYPE_CODES";
CREATE TABLE "INDEXYEAR_TYPE_CODES" (
  "c_index_year_type_code" CHAR(10) NOT NULL,
  "c_index_year_type_desc" CHAR(255),
  "c_index_year_type_hz" CHAR(255),
  "c_notes" CHAR(255)
);

-- ----------------------------
-- Table structure for KINSHIP_CODES
-- ----------------------------
DROP TABLE IF EXISTS "KINSHIP_CODES";
CREATE TABLE "KINSHIP_CODES" (
  "c_kincode" INTEGER,
  "c_kin_pair1" INTEGER,
  "c_kin_pair2" INTEGER,
  "c_kin_pair_notes" CHAR(50),
  "c_kinrel_chn" CHAR(255),
  "c_kinrel" CHAR(255),
  "c_kinrel_alt" CHAR(255),
  "c_pick_sorting" INTEGER,
  "c_upstep" INTEGER,
  "c_dwnstep" INTEGER,
  "c_marstep" INTEGER,
  "c_colstep" INTEGER,
  "c_kinrel_simplified" CHAR(255)
);

-- ----------------------------
-- Table structure for KIN_DATA
-- ----------------------------
DROP TABLE IF EXISTS "KIN_DATA";
CREATE TABLE "KIN_DATA" (
  "c_personid" INTEGER NOT NULL,
  "c_kin_id" INTEGER NOT NULL,
  "c_kin_code" INTEGER NOT NULL,
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR,
  "c_autogen_notes" CHAR,
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for KIN_MOURNING_STEPS
-- ----------------------------
DROP TABLE IF EXISTS "KIN_MOURNING_STEPS";
CREATE TABLE "KIN_MOURNING_STEPS" (
  "c_kinrel" CHAR(255),
  "c_upstep" INTEGER,
  "c_dwnstep" INTEGER,
  "c_marstep" INTEGER,
  "c_colstep" INTEGER
);

-- ----------------------------
-- Table structure for KIN_Mourning
-- ----------------------------
DROP TABLE IF EXISTS "KIN_Mourning";
CREATE TABLE "KIN_Mourning" (
  "c_kinrel" CHAR(255),
  "c_kinrel_alt" CHAR(255),
  "c_kinrel_chn" CHAR(255),
  "c_mourning" CHAR(255),
  "c_mourning_chn" CHAR(255),
  "c_kindist" CHAR(255),
  "c_kintype" CHAR(255),
  "c_kintype_desc" CHAR(255),
  "c_kintype_desc_chn" CHAR(255),
  "c_notes" CHAR(255)
);

-- ----------------------------
-- Table structure for LITERARYGENRE_CODES
-- ----------------------------
DROP TABLE IF EXISTS "LITERARYGENRE_CODES";
CREATE TABLE "LITERARYGENRE_CODES" (
  "c_lit_genre_code" INTEGER,
  "c_lit_genre_desc" CHAR(50),
  "c_lit_genre_desc_chn" CHAR(50),
  "c_sortorder" INTEGER
);

-- ----------------------------
-- Table structure for MEASURE_CODES
-- ----------------------------
DROP TABLE IF EXISTS "MEASURE_CODES";
CREATE TABLE "MEASURE_CODES" (
  "c_measure_code" INTEGER,
  "c_measure_desc" CHAR(50),
  "c_measure_desc_chn" CHAR(50)
);

-- ----------------------------
-- Table structure for NIAN_HAO
-- ----------------------------
DROP TABLE IF EXISTS "NIAN_HAO";
CREATE TABLE "NIAN_HAO" (
  "c_nianhao_id" INTEGER,
  "c_dy" INTEGER,
  "c_dynasty_chn" CHAR(255),
  "c_nianhao_chn" CHAR(255),
  "c_nianhao_pin" CHAR(255),
  "c_firstyear" INTEGER,
  "c_lastyear" INTEGER
);

-- ----------------------------
-- Table structure for OCCASION_CODES
-- ----------------------------
DROP TABLE IF EXISTS "OCCASION_CODES";
CREATE TABLE "OCCASION_CODES" (
  "c_occasion_code" INTEGER,
  "c_occasion_desc" CHAR(50),
  "c_occasion_desc_chn" CHAR(50),
  "c_sortorder" INTEGER
);

-- ----------------------------
-- Table structure for OFFICE_CATEGORIES
-- ----------------------------
DROP TABLE IF EXISTS "OFFICE_CATEGORIES";
CREATE TABLE "OFFICE_CATEGORIES" (
  "c_office_category_id" INTEGER,
  "c_category_desc" CHAR(255),
  "c_category_desc_chn" CHAR(255),
  "c_notes" CHAR(255)
);

-- ----------------------------
-- Table structure for OFFICE_CODES
-- ----------------------------
DROP TABLE IF EXISTS "OFFICE_CODES";
CREATE TABLE "OFFICE_CODES" (
  "c_office_id" INTEGER NOT NULL,
  "c_dy" INTEGER,
  "c_office_pinyin" CHAR(255),
  "c_office_chn" CHAR(255),
  "c_office_pinyin_alt" CHAR(255),
  "c_office_chn_alt" CHAR(255),
  "c_office_trans" CHAR(255),
  "c_office_trans_alt" CHAR(255),
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR,
  "c_category_1" CHAR(50),
  "c_category_2" CHAR(50),
  "c_category_3" CHAR(50),
  "c_category_4" CHAR(50),
  "c_office_id_old" INTEGER
);

-- ----------------------------
-- Table structure for OFFICE_CODES_CONVERSION
-- ----------------------------
DROP TABLE IF EXISTS "OFFICE_CODES_CONVERSION";
CREATE TABLE "OFFICE_CODES_CONVERSION" (
  "c_office_id_backup" INTEGER,
  "c_office_chn_backup" CHAR(255),
  "c_office_id" INTEGER,
  "c_office_chn" CHAR(255)
);

-- ----------------------------
-- Table structure for OFFICE_CODE_TYPE_REL
-- ----------------------------
DROP TABLE IF EXISTS "OFFICE_CODE_TYPE_REL";
CREATE TABLE "OFFICE_CODE_TYPE_REL" (
  "c_office_id" INTEGER NOT NULL,
  "c_office_tree_id" CHAR(255) NOT NULL
);

-- ----------------------------
-- Table structure for OFFICE_TYPE_TREE
-- ----------------------------
DROP TABLE IF EXISTS "OFFICE_TYPE_TREE";
CREATE TABLE "OFFICE_TYPE_TREE" (
  "c_office_type_node_id" CHAR(50) NOT NULL,
  "c_office_type_desc" CHAR(255),
  "c_office_type_desc_chn" CHAR(255),
  "c_parent_id" CHAR(50)
);

-- ----------------------------
-- Table structure for OFFICE_TYPE_TREE_backup
-- ----------------------------
DROP TABLE IF EXISTS "OFFICE_TYPE_TREE_backup";
CREATE TABLE "OFFICE_TYPE_TREE_backup" (
  "c_office_type_node_id" CHAR(50),
  "c_tts_node_id" CHAR(255),
  "c_office_type_desc" CHAR(255),
  "c_office_type_desc_chn" CHAR(255),
  "c_parent_id" CHAR(50)
);

-- ----------------------------
-- Table structure for PARENTAL_STATUS_CODES
-- ----------------------------
DROP TABLE IF EXISTS "PARENTAL_STATUS_CODES";
CREATE TABLE "PARENTAL_STATUS_CODES" (
  "c_parental_status_code" INTEGER,
  "c_parental_status_desc" CHAR(255),
  "c_parental_status_desc_chn" CHAR(255)
);

-- ----------------------------
-- Table structure for PLACE_CODES
-- ----------------------------
DROP TABLE IF EXISTS "PLACE_CODES";
CREATE TABLE "PLACE_CODES" (
  "c_place_id" FLOAT,
  "c_place_1990" CHAR(50),
  "c_name" CHAR(50),
  "c_name_chn" CHAR(255),
  "x_coord" FLOAT,
  "y_coord" FLOAT
);

-- ----------------------------
-- Table structure for POSSESSION_ACT_CODES
-- ----------------------------
DROP TABLE IF EXISTS "POSSESSION_ACT_CODES";
CREATE TABLE "POSSESSION_ACT_CODES" (
  "c_possession_act_code" INTEGER,
  "c_possession_act_desc" CHAR(50),
  "c_possession_act_desc_chn" CHAR(50)
);

-- ----------------------------
-- Table structure for POSSESSION_ADDR
-- ----------------------------
DROP TABLE IF EXISTS "POSSESSION_ADDR";
CREATE TABLE "POSSESSION_ADDR" (
  "c_possession_record_id" INTEGER,
  "c_personid" INTEGER,
  "c_addr_id" INTEGER
);

-- ----------------------------
-- Table structure for POSSESSION_DATA
-- ----------------------------
DROP TABLE IF EXISTS "POSSESSION_DATA";
CREATE TABLE "POSSESSION_DATA" (
  "c_personid" INTEGER,
  "c_possession_record_id" INTEGER NOT NULL,
  "c_sequence" INTEGER,
  "c_possession_act_code" INTEGER,
  "c_possession_desc" CHAR(50),
  "c_possession_desc_chn" CHAR(50),
  "c_quantity" CHAR(50),
  "c_measure_code" INTEGER,
  "c_possession_yr" INTEGER,
  "c_possession_nh_code" INTEGER,
  "c_possession_nh_yr" INTEGER,
  "c_possession_yr_range" INTEGER,
  "c_addr_id" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(50),
  "c_notes" CHAR,
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for POSTED_TO_ADDR_DATA
-- ----------------------------
DROP TABLE IF EXISTS "POSTED_TO_ADDR_DATA";
CREATE TABLE "POSTED_TO_ADDR_DATA" (
  "c_posting_id" INTEGER NOT NULL,
  "c_personid" INTEGER,
  "c_office_id" INTEGER NOT NULL,
  "c_addr_id" INTEGER NOT NULL,
  "c_posting_id_old" INTEGER
);

-- ----------------------------
-- Table structure for POSTED_TO_OFFICE_DATA
-- ----------------------------
DROP TABLE IF EXISTS "POSTED_TO_OFFICE_DATA";
CREATE TABLE "POSTED_TO_OFFICE_DATA" (
  "c_personid" INTEGER,
  "c_office_id" INTEGER NOT NULL,
  "c_posting_id" INTEGER NOT NULL,
  "c_posting_id_old" INTEGER,
  "c_sequence" INTEGER,
  "c_firstyear" INTEGER,
  "c_fy_nh_code" INTEGER,
  "c_fy_nh_year" INTEGER,
  "c_fy_range" INTEGER,
  "c_lastyear" INTEGER,
  "c_ly_nh_code" INTEGER,
  "c_ly_nh_year" INTEGER,
  "c_ly_range" INTEGER,
  "c_appt_type_code" INTEGER,
  "c_assume_office_code" INTEGER,
  "c_inst_code" INTEGER,
  "c_inst_name_code" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR,
  "c_office_id_backup" INTEGER,
  "c_office_category_id" INTEGER,
  "c_fy_intercalary" BOOLEAN(2) NOT NULL,
  "c_fy_month" INTEGER,
  "c_ly_intercalary" BOOLEAN(2) NOT NULL,
  "c_ly_month" INTEGER,
  "c_fy_day" INTEGER,
  "c_ly_day" INTEGER,
  "c_fy_day_gz" INTEGER,
  "c_ly_day_gz" INTEGER,
  "c_dy" INTEGER,
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for POSTING_DATA
-- ----------------------------
DROP TABLE IF EXISTS "POSTING_DATA";
CREATE TABLE "POSTING_DATA" (
  "c_personid" INTEGER,
  "c_posting_id" INTEGER NOT NULL,
  "c_posting_id_old" INTEGER
);

-- ----------------------------
-- Table structure for SCHOLARLYTOPIC_CODES
-- ----------------------------
DROP TABLE IF EXISTS "SCHOLARLYTOPIC_CODES";
CREATE TABLE "SCHOLARLYTOPIC_CODES" (
  "c_topic_code" INTEGER,
  "c_topic_desc" CHAR(50),
  "c_topic_desc_chn" CHAR(50),
  "c_topic_type_code" INTEGER,
  "c_topic_type_desc" CHAR(50),
  "c_topic_type_desc_chn" CHAR(50),
  "c_sortorder" INTEGER
);

-- ----------------------------
-- Table structure for SOCIAL_INSTITUTION_ADDR
-- ----------------------------
DROP TABLE IF EXISTS "SOCIAL_INSTITUTION_ADDR";
CREATE TABLE "SOCIAL_INSTITUTION_ADDR" (
  "c_inst_name_code" INTEGER NOT NULL,
  "c_inst_code" INTEGER NOT NULL,
  "c_inst_addr_type_code" INTEGER NOT NULL,
  "c_inst_addr_begin_year" INTEGER,
  "c_inst_addr_end_year" INTEGER,
  "c_inst_addr_id" INTEGER NOT NULL,
  "inst_xcoord" FLOAT NOT NULL,
  "inst_ycoord" FLOAT NOT NULL,
  "c_source" INTEGER,
  "c_pages" CHAR(50),
  "c_notes" CHAR
);

-- ----------------------------
-- Table structure for SOCIAL_INSTITUTION_ADDR_TYPES
-- ----------------------------
DROP TABLE IF EXISTS "SOCIAL_INSTITUTION_ADDR_TYPES";
CREATE TABLE "SOCIAL_INSTITUTION_ADDR_TYPES" (
  "c_inst_addr_type_code" INTEGER,
  "c_inst_addr_type_desc" CHAR(255),
  "c_inst_addr_type_chn" CHAR(255),
  "c_notes" CHAR(255)
);

-- ----------------------------
-- Table structure for SOCIAL_INSTITUTION_ALTNAME_CODES
-- ----------------------------
DROP TABLE IF EXISTS "SOCIAL_INSTITUTION_ALTNAME_CODES";
CREATE TABLE "SOCIAL_INSTITUTION_ALTNAME_CODES" (
  "c_inst_altname_type" INTEGER,
  "c_inst_altname_desc" CHAR(255),
  "c_inst_altname_chn" CHAR(255),
  "c_notes" CHAR(255)
);

-- ----------------------------
-- Table structure for SOCIAL_INSTITUTION_ALTNAME_DATA
-- ----------------------------
DROP TABLE IF EXISTS "SOCIAL_INSTITUTION_ALTNAME_DATA";
CREATE TABLE "SOCIAL_INSTITUTION_ALTNAME_DATA" (
  "c_inst_name_code" INTEGER,
  "c_inst_code" INTEGER,
  "c_inst_altname_type" INTEGER,
  "c_inst_altname_hz" CHAR(50),
  "c_inst_altname_py" CHAR(50),
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR
);

-- ----------------------------
-- Table structure for SOCIAL_INSTITUTION_CODES
-- ----------------------------
DROP TABLE IF EXISTS "SOCIAL_INSTITUTION_CODES";
CREATE TABLE "SOCIAL_INSTITUTION_CODES" (
  "c_inst_name_code" INTEGER NOT NULL,
  "c_inst_code" INTEGER NOT NULL,
  "c_inst_type_code" INTEGER,
  "c_inst_begin_year" INTEGER,
  "c_by_nianhao_code" INTEGER,
  "c_by_nianhao_year" INTEGER,
  "c_by_year_range" INTEGER,
  "c_inst_begin_dy" INTEGER,
  "c_inst_floruit_dy" INTEGER,
  "c_inst_first_known_year" INTEGER,
  "c_inst_end_year" INTEGER,
  "c_ey_nianhao_code" INTEGER,
  "c_ey_nianhao_year" INTEGER,
  "c_ey_year_range" INTEGER,
  "c_inst_end_dy" INTEGER,
  "c_inst_last_known_year" INTEGER,
  "c_source" INTEGER,
  "c_pages" CHAR(50),
  "c_notes" CHAR
);

-- ----------------------------
-- Table structure for SOCIAL_INSTITUTION_CODES_CONVERSION
-- ----------------------------
DROP TABLE IF EXISTS "SOCIAL_INSTITUTION_CODES_CONVERSION";
CREATE TABLE "SOCIAL_INSTITUTION_CODES_CONVERSION" (
  "c_inst_name_code" INTEGER,
  "c_inst_code" INTEGER,
  "c_inst_code_new" INTEGER,
  "c_new_new_code" INTEGER
);

-- ----------------------------
-- Table structure for SOCIAL_INSTITUTION_NAME_CODES
-- ----------------------------
DROP TABLE IF EXISTS "SOCIAL_INSTITUTION_NAME_CODES";
CREATE TABLE "SOCIAL_INSTITUTION_NAME_CODES" (
  "c_inst_name_code" INTEGER,
  "c_inst_name_hz" CHAR(50),
  "c_inst_name_py" CHAR(50)
);

-- ----------------------------
-- Table structure for SOCIAL_INSTITUTION_TYPES
-- ----------------------------
DROP TABLE IF EXISTS "SOCIAL_INSTITUTION_TYPES";
CREATE TABLE "SOCIAL_INSTITUTION_TYPES" (
  "c_inst_type_code" INTEGER,
  "c_inst_type_py" CHAR(50),
  "c_inst_type_hz" CHAR(50)
);

-- ----------------------------
-- Table structure for STATUS_CODES
-- ----------------------------
DROP TABLE IF EXISTS "STATUS_CODES";
CREATE TABLE "STATUS_CODES" (
  "c_status_code" INTEGER,
  "c_status_desc" CHAR(255),
  "c_status_desc_chn" CHAR(255)
);

-- ----------------------------
-- Table structure for STATUS_CODE_TYPE_REL
-- ----------------------------
DROP TABLE IF EXISTS "STATUS_CODE_TYPE_REL";
CREATE TABLE "STATUS_CODE_TYPE_REL" (
  "c_status_code" INTEGER,
  "c_status_type_code" CHAR(12)
);

-- ----------------------------
-- Table structure for STATUS_DATA
-- ----------------------------
DROP TABLE IF EXISTS "STATUS_DATA";
CREATE TABLE "STATUS_DATA" (
  "c_personid" INTEGER NOT NULL,
  "c_sequence" INTEGER NOT NULL,
  "c_status_code" INTEGER NOT NULL,
  "c_firstyear" INTEGER,
  "c_fy_nh_code" INTEGER,
  "c_fy_nh_year" INTEGER,
  "c_fy_range" INTEGER,
  "c_lastyear" INTEGER,
  "c_ly_nh_code" INTEGER,
  "c_ly_nh_year" INTEGER,
  "c_ly_range" INTEGER,
  "c_supplement" CHAR(255),
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_notes" CHAR,
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for STATUS_TYPES
-- ----------------------------
DROP TABLE IF EXISTS "STATUS_TYPES";
CREATE TABLE "STATUS_TYPES" (
  "c_status_type_code" CHAR(12) NOT NULL,
  "c_status_type_desc" CHAR(255),
  "c_status_type_chn" CHAR(255),
  "c_status_type_parent_code" CHAR(255)
);

-- ----------------------------
-- Table structure for TEXT_BIBLCAT_CODES
-- ----------------------------
DROP TABLE IF EXISTS "TEXT_BIBLCAT_CODES";
CREATE TABLE "TEXT_BIBLCAT_CODES" (
  "c_text_cat_code" INTEGER NOT NULL,
  "c_text_cat_desc" CHAR(255),
  "c_text_cat_desc_chn" CHAR(255),
  "c_text_cat_pinyin" CHAR(255),
  "c_text_cat_parent_id" CHAR(255),
  "c_text_cat_level" CHAR(255),
  "c_text_cat_sortorder" INTEGER
);

-- ----------------------------
-- Table structure for TEXT_BIBLCAT_CODE_TYPE_REL
-- ----------------------------
DROP TABLE IF EXISTS "TEXT_BIBLCAT_CODE_TYPE_REL";
CREATE TABLE "TEXT_BIBLCAT_CODE_TYPE_REL" (
  "c_text_cat_code" INTEGER,
  "c_text_cat_type_id" CHAR(255)
);

-- ----------------------------
-- Table structure for TEXT_BIBLCAT_TYPES
-- ----------------------------
DROP TABLE IF EXISTS "TEXT_BIBLCAT_TYPES";
CREATE TABLE "TEXT_BIBLCAT_TYPES" (
  "c_text_cat_type_id" CHAR(255),
  "c_text_cat_type_desc" CHAR(255),
  "c_text_cat_type_desc_chn" CHAR(255),
  "c_text_cat_type_parent_id" CHAR(255),
  "c_text_cat_type_level" INTEGER,
  "c_text_cat_type_sortorder" INTEGER
);

-- ----------------------------
-- Table structure for TEXT_CODES
-- ----------------------------
DROP TABLE IF EXISTS "TEXT_CODES";
CREATE TABLE "TEXT_CODES" (
  "c_textid" INTEGER NOT NULL,
  "c_title_chn" CHAR(255),
  "c_suffix_version" CHAR(255),
  "c_title" CHAR(255),
  "c_title_trans" CHAR(255),
  "c_text_type_id" CHAR(255),
  "c_text_year" INTEGER,
  "c_text_nh_code" INTEGER,
  "c_text_nh_year" INTEGER,
  "c_text_range_code" INTEGER,
  "c_period" CHAR(255),
  "c_bibl_cat_code" INTEGER,
  "c_extant" INTEGER,
  "c_text_country" INTEGER,
  "c_text_dy" INTEGER,
  "c_pub_country" INTEGER,
  "c_pub_dy" INTEGER,
  "c_pub_year" CHAR(50),
  "c_pub_nh_code" INTEGER,
  "c_pub_nh_year" INTEGER,
  "c_pub_range_code" INTEGER,
  "c_pub_loc" CHAR(255),
  "c_publisher" CHAR(255),
  "c_pub_notes" CHAR(255),
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_url_api" CHAR(255),
  "c_url_api_coda" CHAR(255),
  "c_url_homepage" CHAR(255),
  "c_notes" CHAR,
  "c_number" CHAR(255),
  "c_counter" CHAR(255),
  "c_title_alt_chn" CHAR(255),
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for TEXT_INSTANCE_DATA
-- ----------------------------
DROP TABLE IF EXISTS "TEXT_INSTANCE_DATA";
CREATE TABLE "TEXT_INSTANCE_DATA" (
  "c_textid" INTEGER NOT NULL,
  "c_text_edition_id" INTEGER NOT NULL,
  "c_text_instance_id" INTEGER NOT NULL,
  "c_instance_title_chn" CHAR(255),
  "c_instance_title" CHAR(255),
  "c_instance_title_trans" CHAR(255),
  "c_part_of_instance" INTEGER,
  "c_part_of_instance_notes" CHAR(255),
  "c_pub_country" INTEGER,
  "c_pub_dy" INTEGER,
  "c_pub_year" CHAR(255),
  "c_pub_nh_code" INTEGER,
  "c_pub_nh_year" INTEGER,
  "c_pub_range_code" INTEGER,
  "c_pub_loc" CHAR(255),
  "c_publisher" CHAR(255),
  "c_print" CHAR(255),
  "c_pub_notes" CHAR(255),
  "c_source" INTEGER,
  "c_pages" CHAR(255),
  "c_extant" INTEGER,
  "c_url_api" CHAR(255),
  "c_url_homepage" CHAR(255),
  "c_notes" CHAR,
  "c_number" CHAR(255),
  "c_counter" CHAR(255),
  "c_title_alt_chn" CHAR(255),
  "c_created_by" CHAR(255),
  "c_created_date" CHAR(255),
  "c_modified_by" CHAR(255),
  "c_modified_date" CHAR(255)
);

-- ----------------------------
-- Table structure for TEXT_ROLE_CODES
-- ----------------------------
DROP TABLE IF EXISTS "TEXT_ROLE_CODES";
CREATE TABLE "TEXT_ROLE_CODES" (
  "c_role_id" INTEGER,
  "c_role_desc" CHAR(255),
  "c_role_desc_chn" CHAR(255)
);

-- ----------------------------
-- Table structure for TEXT_TYPE
-- ----------------------------
DROP TABLE IF EXISTS "TEXT_TYPE";
CREATE TABLE "TEXT_TYPE" (
  "c_text_type_code" CHAR(255),
  "c_text_type_desc" CHAR(255),
  "c_text_type_desc_chn" CHAR(255),
  "c_text_type_parent_id" CHAR(255),
  "c_text_type_level" INTEGER,
  "c_text_type_sortorder" INTEGER
);

-- ----------------------------
-- Table structure for TMP_INDEX_YEAR
-- ----------------------------
DROP TABLE IF EXISTS "TMP_INDEX_YEAR";
CREATE TABLE "TMP_INDEX_YEAR" (
  "c_personid" INTEGER NOT NULL,
  "c_index_year" INTEGER,
  "c_index_year_source_id" INTEGER
);

-- ----------------------------
-- Table structure for TablesFields
-- ----------------------------
DROP TABLE IF EXISTS "TablesFields";
CREATE TABLE "TablesFields" (
  "RowNum" INTEGER,
  "DumpTblNm" CHAR(255),
  "DumpFldNm" CHAR(255),
  "AccessTblNm" CHAR(255),
  "AccessFldNm" CHAR(255),
  "IndexOnField" CHAR(255),
  "DataFormat" CHAR(255),
  "NULL_allowed" BOOLEAN(2) NOT NULL,
  "ForeignKey" CHAR(255),
  "ForeignKeyBaseField" CHAR(255)
);

-- ----------------------------
-- Table structure for TablesFieldsChanges
-- ----------------------------
DROP TABLE IF EXISTS "TablesFieldsChanges";
CREATE TABLE "TablesFieldsChanges" (
  "TableName" CHAR(255),
  "FieldName" CHAR(255),
  "Change" CHAR(255),
  "ChangeDate" CHAR(255),
  "ChangeNotes" CHAR(255)
);

-- ----------------------------
-- Table structure for YEAR_RANGE_CODES
-- ----------------------------
DROP TABLE IF EXISTS "YEAR_RANGE_CODES";
CREATE TABLE "YEAR_RANGE_CODES" (
  "c_range_code" INTEGER,
  "c_range" CHAR(50),
  "c_range_chn" CHAR(50),
  "c_approx" CHAR(50),
  "c_approx_chn" CHAR(50)
);

-- ----------------------------
-- Indexes structure for table ADDRESSES
-- ----------------------------
CREATE INDEX "ADDRESSES_belongs1_ID"
ON "ADDRESSES" (
  "belongs1_ID" ASC
);
CREATE INDEX "ADDRESSES_belongs2_ID"
ON "ADDRESSES" (
  "belongs2_ID" ASC
);
CREATE INDEX "ADDRESSES_belongs3_ID"
ON "ADDRESSES" (
  "belongs3_ID" ASC
);
CREATE INDEX "ADDRESSES_belongs4_ID"
ON "ADDRESSES" (
  "belongs4_ID" ASC
);
CREATE INDEX "ADDRESSES_belongs5_ID"
ON "ADDRESSES" (
  "belongs5_ID" ASC
);
CREATE INDEX "ADDRESSES_c_addr_id"
ON "ADDRESSES" (
  "c_addr_id" ASC
);

-- ----------------------------
-- Indexes structure for table ADDR_BELONGS_DATA
-- ----------------------------
CREATE INDEX "ADDR_BELONGS_DATA_Belongs"
ON "ADDR_BELONGS_DATA" (
  "c_belongs_to" ASC,
  "c_addr_id" ASC
);
CREATE INDEX "ADDR_BELONGS_DATA_PrimaryKey"
ON "ADDR_BELONGS_DATA" (
  "c_addr_id" ASC,
  "c_belongs_to" ASC,
  "c_firstyear" ASC,
  "c_lastyear" ASC
);
CREATE INDEX "ADDR_BELONGS_DATA_ZZZ_ADDR_BELONGSc_addr_id"
ON "ADDR_BELONGS_DATA" (
  "c_addr_id" ASC
);

-- ----------------------------
-- Indexes structure for table ADDR_CODES
-- ----------------------------
CREATE INDEX "ADDR_CODES_CHGIS_PT_ID"
ON "ADDR_CODES" (
  "CHGIS_PT_ID" ASC
);
CREATE INDEX "ADDR_CODES_PrimaryKey"
ON "ADDR_CODES" (
  "c_addr_id" ASC
);

-- ----------------------------
-- Indexes structure for table ADDR_PLACE_DATA
-- ----------------------------
CREATE INDEX "ADDR_PLACE_DATA_c_addr_id"
ON "ADDR_PLACE_DATA" (
  "c_addr_id" ASC
);
CREATE INDEX "ADDR_PLACE_DATA_c_place_id"
ON "ADDR_PLACE_DATA" (
  "c_place_id" ASC
);

-- ----------------------------
-- Indexes structure for table ADDR_XY
-- ----------------------------
CREATE INDEX "ADDR_XY_CHGIS_PT_ID"
ON "ADDR_XY" (
  "c_source_reference" ASC
);
CREATE INDEX "ADDR_XY_PrimaryKey"
ON "ADDR_XY" (
  "c_addr_id" ASC
);
CREATE INDEX "ADDR_XY_c_source_id"
ON "ADDR_XY" (
  "c_source_id" ASC
);

-- ----------------------------
-- Indexes structure for table ALTNAME_CODES
-- ----------------------------
CREATE INDEX "ALTNAME_CODES_PrimaryKey"
ON "ALTNAME_CODES" (
  "c_name_type_code" ASC
);

-- ----------------------------
-- Indexes structure for table ALTNAME_DATA
-- ----------------------------
CREATE INDEX "ALTNAME_DATA_Primary Key"
ON "ALTNAME_DATA" (
  "c_personid" ASC,
  "c_alt_name_chn" ASC,
  "c_alt_name_type_code" ASC
);
CREATE INDEX "ALTNAME_DATA_c_alt_name_type_code"
ON "ALTNAME_DATA" (
  "c_alt_name_type_code" ASC
);
CREATE INDEX "ALTNAME_DATA_c_personid"
ON "ALTNAME_DATA" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table APPOINTMENT_TYPE_CODES
-- ----------------------------
CREATE INDEX "APPOINTMENT_TYPE_CODES_PrimaryKey"
ON "APPOINTMENT_TYPE_CODES" (
  "c_appt_type_code" ASC
);
CREATE INDEX "APPOINTMENT_TYPE_CODES_c_appointment_code"
ON "APPOINTMENT_TYPE_CODES" (
  "c_appt_type_code" ASC
);

-- ----------------------------
-- Indexes structure for table ASSOC_CODES
-- ----------------------------
CREATE INDEX "ASSOC_CODES_ASSOC_CODESc_assoc_pair"
ON "ASSOC_CODES" (
  "c_assoc_pair" ASC
);
CREATE INDEX "ASSOC_CODES_ASSOC_CODESc_assoc_pair2"
ON "ASSOC_CODES" (
  "c_assoc_pair2" ASC
);
CREATE INDEX "ASSOC_CODES_PrimaryKey"
ON "ASSOC_CODES" (
  "c_assoc_code" ASC
);
CREATE INDEX "ASSOC_CODES_c_assoc_code"
ON "ASSOC_CODES" (
  "c_assoc_code" ASC
);

-- ----------------------------
-- Indexes structure for table ASSOC_CODE_TYPE_REL
-- ----------------------------
CREATE INDEX "ASSOC_CODE_TYPE_REL_PrimaryKey"
ON "ASSOC_CODE_TYPE_REL" (
  "c_assoc_code" ASC,
  "c_assoc_type_id" ASC
);
CREATE INDEX "ASSOC_CODE_TYPE_REL_code_id"
ON "ASSOC_CODE_TYPE_REL" (
  "c_assoc_code" ASC
);
CREATE INDEX "ASSOC_CODE_TYPE_REL_type_id"
ON "ASSOC_CODE_TYPE_REL" (
  "c_assoc_type_id" ASC
);

-- ----------------------------
-- Indexes structure for table ASSOC_DATA
-- ----------------------------
CREATE INDEX "ASSOC_DATA_Primary Key"
ON "ASSOC_DATA" (
  "c_assoc_code" ASC,
  "c_personid" ASC,
  "c_assoc_id" ASC,
  "c_kin_code" ASC,
  "c_kin_id" ASC,
  "c_assoc_kin_code" ASC,
  "c_assoc_kin_id" ASC,
  "c_text_title" ASC
);
CREATE INDEX "ASSOC_DATA_assoc_kin_id"
ON "ASSOC_DATA" (
  "c_assoc_kin_id" ASC
);
CREATE INDEX "ASSOC_DATA_c_addr_id"
ON "ASSOC_DATA" (
  "c_addr_id" ASC
);
CREATE INDEX "ASSOC_DATA_c_assoc_code"
ON "ASSOC_DATA" (
  "c_assoc_code" ASC
);
CREATE INDEX "ASSOC_DATA_c_assoc_id"
ON "ASSOC_DATA" (
  "c_assoc_id" ASC
);
CREATE INDEX "ASSOC_DATA_c_assoc_kin_code"
ON "ASSOC_DATA" (
  "c_assoc_kin_code" ASC
);
CREATE INDEX "ASSOC_DATA_c_inst_code"
ON "ASSOC_DATA" (
  "c_inst_code" ASC,
  "c_inst_name_code" ASC
);
CREATE INDEX "ASSOC_DATA_c_inst_name_code"
ON "ASSOC_DATA" (
  "c_inst_name_code" ASC
);
CREATE INDEX "ASSOC_DATA_c_kin_code"
ON "ASSOC_DATA" (
  "c_kin_code" ASC
);
CREATE INDEX "ASSOC_DATA_c_kin_id"
ON "ASSOC_DATA" (
  "c_kin_id" ASC
);
CREATE INDEX "ASSOC_DATA_c_personid"
ON "ASSOC_DATA" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table ASSOC_TYPES
-- ----------------------------
CREATE INDEX "ASSOC_TYPES_PrimaryKey"
ON "ASSOC_TYPES" (
  "c_assoc_type_id" ASC
);
CREATE INDEX "ASSOC_TYPES_type_id"
ON "ASSOC_TYPES" (
  "c_assoc_type_id" ASC
);
CREATE INDEX "ASSOC_TYPES_type_parent_id"
ON "ASSOC_TYPES" (
  "c_assoc_type_parent_id" ASC
);

-- ----------------------------
-- Indexes structure for table ASSUME_OFFICE_CODES
-- ----------------------------
CREATE INDEX "ASSUME_OFFICE_CODES_PrimaryKey"
ON "ASSUME_OFFICE_CODES" (
  "c_assume_office_code" ASC
);
CREATE INDEX "ASSUME_OFFICE_CODES_c_appointment_code"
ON "ASSUME_OFFICE_CODES" (
  "c_assume_office_code" ASC
);

-- ----------------------------
-- Indexes structure for table BIOG_ADDR_CODES
-- ----------------------------
CREATE INDEX "BIOG_ADDR_CODES_PrimaryKey"
ON "BIOG_ADDR_CODES" (
  "c_addr_type" ASC
);

-- ----------------------------
-- Indexes structure for table BIOG_ADDR_DATA
-- ----------------------------
CREATE INDEX "BIOG_ADDR_DATA_BIOG_ADDR_DATAc_addr_type"
ON "BIOG_ADDR_DATA" (
  "c_addr_type" ASC
);
CREATE INDEX "BIOG_ADDR_DATA_PrimaryKey"
ON "BIOG_ADDR_DATA" (
  "c_personid" ASC,
  "c_addr_id" ASC,
  "c_addr_type" ASC,
  "c_sequence" ASC
);
CREATE INDEX "BIOG_ADDR_DATA_addr_type"
ON "BIOG_ADDR_DATA" (
  "c_personid" ASC,
  "c_addr_type" ASC
);
CREATE INDEX "BIOG_ADDR_DATA_c_addr_id"
ON "BIOG_ADDR_DATA" (
  "c_addr_id" ASC
);
CREATE INDEX "BIOG_ADDR_DATA_c_personid"
ON "BIOG_ADDR_DATA" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table BIOG_INST_CODES
-- ----------------------------
CREATE INDEX "BIOG_INST_CODES_PrimaryKey"
ON "BIOG_INST_CODES" (
  "c_bi_role_code" ASC
);
CREATE INDEX "BIOG_INST_CODES_c_bi_role_code"
ON "BIOG_INST_CODES" (
  "c_bi_role_code" ASC
);

-- ----------------------------
-- Indexes structure for table BIOG_INST_DATA
-- ----------------------------
CREATE INDEX "BIOG_INST_DATA_PrimaryKey"
ON "BIOG_INST_DATA" (
  "c_personid" ASC,
  "c_inst_name_code" ASC,
  "c_inst_code" ASC,
  "c_bi_role_code" ASC
);
CREATE INDEX "BIOG_INST_DATA_c_bi_by_nh_code"
ON "BIOG_INST_DATA" (
  "c_bi_by_nh_code" ASC
);
CREATE INDEX "BIOG_INST_DATA_c_bi_ey_nh_code"
ON "BIOG_INST_DATA" (
  "c_bi_ey_nh_code" ASC
);
CREATE INDEX "BIOG_INST_DATA_c_biog_inst_code"
ON "BIOG_INST_DATA" (
  "c_bi_role_code" ASC
);
CREATE INDEX "BIOG_INST_DATA_c_inst_code"
ON "BIOG_INST_DATA" (
  "c_inst_name_code" ASC,
  "c_inst_code" ASC
);
CREATE INDEX "BIOG_INST_DATA_c_inst_name_code"
ON "BIOG_INST_DATA" (
  "c_inst_name_code" ASC
);
CREATE INDEX "BIOG_INST_DATA_c_personid"
ON "BIOG_INST_DATA" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table BIOG_MAIN
-- ----------------------------
CREATE INDEX "BIOG_MAIN_PrimaryKey"
ON "BIOG_MAIN" (
  "c_personid" ASC
);
CREATE INDEX "BIOG_MAIN_c_index_addr_id"
ON "BIOG_MAIN" (
  "c_index_addr_id" ASC
);
CREATE INDEX "BIOG_MAIN_c_index_addr_type_code"
ON "BIOG_MAIN" (
  "c_index_addr_type_code" ASC
);
CREATE INDEX "BIOG_MAIN_c_name"
ON "BIOG_MAIN" (
  "c_name" ASC
);
CREATE INDEX "BIOG_MAIN_c_name_chn"
ON "BIOG_MAIN" (
  "c_name_chn" ASC
);
CREATE INDEX "BIOG_MAIN_c_personid"
ON "BIOG_MAIN" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table BIOG_SOURCE_DATA
-- ----------------------------
CREATE INDEX "BIOG_SOURCE_DATA_DB_ID"
ON "BIOG_SOURCE_DATA" (
  "c_textid" ASC
);
CREATE INDEX "BIOG_SOURCE_DATA_DB_PERSON_ID"
ON "BIOG_SOURCE_DATA" (
  "c_pages" ASC
);
CREATE INDEX "BIOG_SOURCE_DATA_Primary key"
ON "BIOG_SOURCE_DATA" (
  "c_personid" ASC,
  "c_textid" ASC,
  "c_pages" ASC
);
CREATE INDEX "BIOG_SOURCE_DATA_c_personid"
ON "BIOG_SOURCE_DATA" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table BIOG_TEXT_DATA
-- ----------------------------
CREATE INDEX "BIOG_TEXT_DATA_BIOG_TEXT_DATA_NIAN_HAO"
ON "BIOG_TEXT_DATA" (
  "c_nh_code" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_BIOG_TEXT_DATA_PERSON_ID"
ON "BIOG_TEXT_DATA" (
  "c_personid" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_BIOG_TEXT_DATA_SOURCE_TEXT_ID"
ON "BIOG_TEXT_DATA" (
  "c_source" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_BIOG_TEXT_DATA_TEXT_ID"
ON "BIOG_TEXT_DATA" (
  "c_textid" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_BIOG_TEXT_DATA_TEXT_ROLE_CODE"
ON "BIOG_TEXT_DATA" (
  "c_role_id" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_BIOG_TEXT_DATA_YEAR_RANGE_CODE"
ON "BIOG_TEXT_DATA" (
  "c_range_code" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_PrimaryKey"
ON "BIOG_TEXT_DATA" (
  "c_textid" ASC,
  "c_personid" ASC,
  "c_role_id" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_c_nh_code"
ON "BIOG_TEXT_DATA" (
  "c_nh_code" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_c_personid"
ON "BIOG_TEXT_DATA" (
  "c_personid" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_c_range_code"
ON "BIOG_TEXT_DATA" (
  "c_range_code" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_c_role_id"
ON "BIOG_TEXT_DATA" (
  "c_role_id" ASC
);
CREATE INDEX "BIOG_TEXT_DATA_c_textid"
ON "BIOG_TEXT_DATA" (
  "c_textid" ASC
);

-- ----------------------------
-- Indexes structure for table CBDB_NAME_LIST
-- ----------------------------
CREATE INDEX "CBDB_NAME_LIST_PrimaryKey"
ON "CBDB_NAME_LIST" (
  "c_personid" ASC,
  "name" ASC,
  "source" ASC
);

-- ----------------------------
-- Indexes structure for table CHORONYM_CODES
-- ----------------------------
CREATE INDEX "CHORONYM_CODES_PrimaryKey"
ON "CHORONYM_CODES" (
  "c_choronym_code" ASC
);

-- ----------------------------
-- Indexes structure for table COUNTRY_CODES
-- ----------------------------
CREATE INDEX "COUNTRY_CODES_PrimaryKey"
ON "COUNTRY_CODES" (
  "c_country_code" ASC
);
CREATE INDEX "COUNTRY_CODES_c_country_code"
ON "COUNTRY_CODES" (
  "c_country_code" ASC
);

-- ----------------------------
-- Indexes structure for table CopyMissingTables
-- ----------------------------
CREATE INDEX "CopyMissingTables_PrimaryKey"
ON "CopyMissingTables" (
  "ID" ASC
);

-- ----------------------------
-- Indexes structure for table CopyTables
-- ----------------------------
CREATE INDEX "CopyTables_PrimaryKey"
ON "CopyTables" (
  "TableName" ASC
);

-- ----------------------------
-- Indexes structure for table CopyTablesDefault
-- ----------------------------
CREATE INDEX "CopyTablesDefault_PrimaryKey"
ON "CopyTablesDefault" (
  "ID" ASC
);

-- ----------------------------
-- Indexes structure for table DYNASTIES
-- ----------------------------
CREATE INDEX "DYNASTIES_PrimaryKey"
ON "DYNASTIES" (
  "c_dy" ASC
);

-- ----------------------------
-- Indexes structure for table ENTRY_CODES
-- ----------------------------
CREATE INDEX "ENTRY_CODES_ENTRY_CODESc_entry_code"
ON "ENTRY_CODES" (
  "c_entry_code" ASC
);
CREATE INDEX "ENTRY_CODES_PrimaryKey"
ON "ENTRY_CODES" (
  "c_entry_code" ASC
);

-- ----------------------------
-- Indexes structure for table ENTRY_CODE_TYPE_REL
-- ----------------------------
CREATE INDEX "ENTRY_CODE_TYPE_REL_PrimaryKey"
ON "ENTRY_CODE_TYPE_REL" (
  "c_entry_code" ASC,
  "c_entry_type" ASC
);
CREATE INDEX "ENTRY_CODE_TYPE_REL_code_id"
ON "ENTRY_CODE_TYPE_REL" (
  "c_entry_code" ASC
);
CREATE INDEX "ENTRY_CODE_TYPE_REL_type_id"
ON "ENTRY_CODE_TYPE_REL" (
  "c_entry_type" ASC
);

-- ----------------------------
-- Indexes structure for table ENTRY_DATA
-- ----------------------------
CREATE INDEX "ENTRY_DATA_c_addr_id"
ON "ENTRY_DATA" (
  "c_entry_addr_id" ASC
);
CREATE INDEX "ENTRY_DATA_c_assoc_code"
ON "ENTRY_DATA" (
  "c_assoc_code" ASC
);
CREATE INDEX "ENTRY_DATA_c_assoc_id"
ON "ENTRY_DATA" (
  "c_assoc_id" ASC
);
CREATE INDEX "ENTRY_DATA_c_entry_code"
ON "ENTRY_DATA" (
  "c_entry_code" ASC
);
CREATE INDEX "ENTRY_DATA_c_kin_code"
ON "ENTRY_DATA" (
  "c_kin_code" ASC
);
CREATE INDEX "ENTRY_DATA_c_kin_id"
ON "ENTRY_DATA" (
  "c_kin_id" ASC
);
CREATE INDEX "ENTRY_DATA_c_nianhao_id"
ON "ENTRY_DATA" (
  "c_nianhao_id" ASC
);
CREATE INDEX "ENTRY_DATA_c_personid"
ON "ENTRY_DATA" (
  "c_personid" ASC
);
CREATE INDEX "ENTRY_DATA_c_social_ins_name_code"
ON "ENTRY_DATA" (
  "c_inst_name_code" ASC
);
CREATE INDEX "ENTRY_DATA_c_social_inst_code"
ON "ENTRY_DATA" (
  "c_inst_code" ASC
);
CREATE INDEX "ENTRY_DATA_entry_data"
ON "ENTRY_DATA" (
  "c_personid" ASC,
  "c_entry_code" ASC,
  "c_sequence" ASC,
  "c_kin_code" ASC,
  "c_kin_id" ASC,
  "c_assoc_code" ASC,
  "c_assoc_id" ASC,
  "c_year" ASC,
  "c_inst_code" ASC,
  "c_inst_name_code" ASC
);

-- ----------------------------
-- Indexes structure for table ENTRY_TYPES
-- ----------------------------
CREATE INDEX "ENTRY_TYPES_PrimaryKey"
ON "ENTRY_TYPES" (
  "c_entry_type" ASC
);
CREATE INDEX "ENTRY_TYPES_type_id"
ON "ENTRY_TYPES" (
  "c_entry_type" ASC
);
CREATE INDEX "ENTRY_TYPES_type_parent_id"
ON "ENTRY_TYPES" (
  "c_entry_type_parent_id" ASC
);

-- ----------------------------
-- Indexes structure for table ETHNICITY_TRIBE_CODES
-- ----------------------------
CREATE INDEX "ETHNICITY_TRIBE_CODES_c_ethnicity_code"
ON "ETHNICITY_TRIBE_CODES" (
  "c_ethnicity_code" ASC
);
CREATE INDEX "ETHNICITY_TRIBE_CODES_ethnicity_tree"
ON "ETHNICITY_TRIBE_CODES" (
  "c_group_code" ASC,
  "c_subgroup_code" ASC,
  "c_altname_code" ASC
);

-- ----------------------------
-- Indexes structure for table EVENTS_ADDR
-- ----------------------------
CREATE INDEX "EVENTS_ADDR_PrimaryKey"
ON "EVENTS_ADDR" (
  "c_event_record_id" ASC,
  "c_personid" ASC,
  "c_addr_id" ASC
);
CREATE INDEX "EVENTS_ADDR_c_addr_id"
ON "EVENTS_ADDR" (
  "c_addr_id" ASC
);
CREATE INDEX "EVENTS_ADDR_c_event_record_id"
ON "EVENTS_ADDR" (
  "c_event_record_id" ASC
);
CREATE INDEX "EVENTS_ADDR_c_nh_code"
ON "EVENTS_ADDR" (
  "c_nh_code" ASC
);
CREATE INDEX "EVENTS_ADDR_c_personid"
ON "EVENTS_ADDR" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table EVENTS_DATA
-- ----------------------------
CREATE INDEX "EVENTS_DATA_c_addr_id"
ON "EVENTS_DATA" (
  "c_addr_id" ASC
);
CREATE INDEX "EVENTS_DATA_c_event_code"
ON "EVENTS_DATA" (
  "c_event_code" ASC
);
CREATE INDEX "EVENTS_DATA_c_event_record_id"
ON "EVENTS_DATA" (
  "c_event_record_id" ASC
);
CREATE INDEX "EVENTS_DATA_c_nh_code"
ON "EVENTS_DATA" (
  "c_nh_code" ASC
);
CREATE INDEX "EVENTS_DATA_c_person_id"
ON "EVENTS_DATA" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table EVENT_CODES
-- ----------------------------
CREATE INDEX "EVENT_CODES_EVENT_CODESc_dy"
ON "EVENT_CODES" (
  "c_dy" ASC
);
CREATE INDEX "EVENT_CODES_PrimaryKey"
ON "EVENT_CODES" (
  "c_event_code" ASC
);
CREATE INDEX "EVENT_CODES_c_addr_id"
ON "EVENT_CODES" (
  "c_addr_id" ASC
);
CREATE INDEX "EVENT_CODES_c_end_yr_nh_code"
ON "EVENT_CODES" (
  "c_ly_nh_code" ASC
);
CREATE INDEX "EVENT_CODES_c_event_code"
ON "EVENT_CODES" (
  "c_event_code" ASC
);
CREATE INDEX "EVENT_CODES_c_fy_nh_code"
ON "EVENT_CODES" (
  "c_fy_nh_code" ASC
);

-- ----------------------------
-- Indexes structure for table EXTANT_CODES
-- ----------------------------
CREATE INDEX "EXTANT_CODES_PrimaryKey"
ON "EXTANT_CODES" (
  "c_extant_code" ASC
);
CREATE INDEX "EXTANT_CODES_c_extant_code"
ON "EXTANT_CODES" (
  "c_extant_code" ASC
);
CREATE INDEX "EXTANT_CODES_c_extant_hd_code"
ON "EXTANT_CODES" (
  "c_extant_code_hd" ASC
);

-- ----------------------------
-- Indexes structure for table ForeignKeys
-- ----------------------------
CREATE INDEX "ForeignKeys_ForeignKey"
ON "ForeignKeys" (
  "ForeignKey" ASC
);
CREATE INDEX "ForeignKeys_PrimaryKey"
ON "ForeignKeys" (
  "AccessTblNm" ASC,
  "AccessFldNm" ASC
);

-- ----------------------------
-- Indexes structure for table FormLabels
-- ----------------------------
CREATE INDEX "FormLabels_c_label_id"
ON "FormLabels" (
  "c_label_id" ASC
);
CREATE INDEX "FormLabels_label"
ON "FormLabels" (
  "c_form" ASC,
  "c_label_id" ASC
);

-- ----------------------------
-- Indexes structure for table GANZHI_CODES
-- ----------------------------
CREATE INDEX "GANZHI_CODES_PrimaryKey"
ON "GANZHI_CODES" (
  "c_ganzhi_code" ASC
);
CREATE INDEX "GANZHI_CODES_c_ganzhi_code"
ON "GANZHI_CODES" (
  "c_ganzhi_code" ASC
);

-- ----------------------------
-- Indexes structure for table HOUSEHOLD_STATUS_CODES
-- ----------------------------
CREATE INDEX "HOUSEHOLD_STATUS_CODES_c_household_status_code"
ON "HOUSEHOLD_STATUS_CODES" (
  "c_household_status_code" ASC
);

-- ----------------------------
-- Indexes structure for table INDEXYEAR_TYPE_CODES
-- ----------------------------
CREATE INDEX "INDEXYEAR_TYPE_CODES_PrimaryKey"
ON "INDEXYEAR_TYPE_CODES" (
  "c_index_year_type_code" ASC
);
CREATE INDEX "INDEXYEAR_TYPE_CODES_c_index_year_type_code"
ON "INDEXYEAR_TYPE_CODES" (
  "c_index_year_type_code" ASC
);

-- ----------------------------
-- Indexes structure for table KINSHIP_CODES
-- ----------------------------
CREATE INDEX "KINSHIP_CODES_KINSHIP_CODES_KIN_PAIR1"
ON "KINSHIP_CODES" (
  "c_kin_pair1" ASC
);
CREATE INDEX "KINSHIP_CODES_KINSHIP_CODES_KIN_PAIR2"
ON "KINSHIP_CODES" (
  "c_kin_pair2" ASC
);
CREATE INDEX "KINSHIP_CODES_KINSHIP_CODESc_kin_pair1"
ON "KINSHIP_CODES" (
  "c_kin_pair1" ASC
);
CREATE INDEX "KINSHIP_CODES_KINSHIP_CODESc_kin_pair2"
ON "KINSHIP_CODES" (
  "c_kin_pair2" ASC
);
CREATE INDEX "KINSHIP_CODES_PrimaryKey"
ON "KINSHIP_CODES" (
  "c_kincode" ASC
);

-- ----------------------------
-- Indexes structure for table KIN_DATA
-- ----------------------------
CREATE INDEX "KIN_DATA_KIN_DATA_KIN_CODES"
ON "KIN_DATA" (
  "c_kin_code" ASC
);
CREATE INDEX "KIN_DATA_KIN_DATA_KIN_ID"
ON "KIN_DATA" (
  "c_kin_id" ASC
);
CREATE INDEX "KIN_DATA_KIN_DATA_PERSON_ID"
ON "KIN_DATA" (
  "c_personid" ASC
);
CREATE INDEX "KIN_DATA_KIN_DATA_SOURCE_TEXT_CODES"
ON "KIN_DATA" (
  "c_source" ASC
);
CREATE INDEX "KIN_DATA_PrimaryKey"
ON "KIN_DATA" (
  "c_personid" ASC,
  "c_kin_id" ASC,
  "c_kin_code" ASC
);
CREATE INDEX "KIN_DATA_c_kin_code"
ON "KIN_DATA" (
  "c_kin_code" ASC
);
CREATE INDEX "KIN_DATA_c_kin_id"
ON "KIN_DATA" (
  "c_kin_id" ASC
);
CREATE INDEX "KIN_DATA_c_personid"
ON "KIN_DATA" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table KIN_Mourning
-- ----------------------------
CREATE INDEX "KIN_Mourning_PrimaryKey"
ON "KIN_Mourning" (
  "c_kinrel" ASC
);

-- ----------------------------
-- Indexes structure for table LITERARYGENRE_CODES
-- ----------------------------
CREATE INDEX "LITERARYGENRE_CODES_PrimaryKey"
ON "LITERARYGENRE_CODES" (
  "c_lit_genre_code" ASC
);
CREATE INDEX "LITERARYGENRE_CODES_c_lit_genre_code"
ON "LITERARYGENRE_CODES" (
  "c_lit_genre_code" ASC
);

-- ----------------------------
-- Indexes structure for table MEASURE_CODES
-- ----------------------------
CREATE INDEX "MEASURE_CODES_PrimaryKey"
ON "MEASURE_CODES" (
  "c_measure_code" ASC
);
CREATE INDEX "MEASURE_CODES_c_measure_id"
ON "MEASURE_CODES" (
  "c_measure_code" ASC
);

-- ----------------------------
-- Indexes structure for table NIAN_HAO
-- ----------------------------
CREATE INDEX "NIAN_HAO_NIAN_HAOc_dy"
ON "NIAN_HAO" (
  "c_dy" ASC
);
CREATE INDEX "NIAN_HAO_PrimaryKey"
ON "NIAN_HAO" (
  "c_nianhao_id" ASC
);
CREATE INDEX "NIAN_HAO_dynasty"
ON "NIAN_HAO" (
  "c_dy" ASC
);

-- ----------------------------
-- Indexes structure for table OCCASION_CODES
-- ----------------------------
CREATE INDEX "OCCASION_CODES_PrimaryKey"
ON "OCCASION_CODES" (
  "c_occasion_code" ASC
);
CREATE INDEX "OCCASION_CODES_c_occasion_code"
ON "OCCASION_CODES" (
  "c_occasion_code" ASC
);

-- ----------------------------
-- Indexes structure for table OFFICE_CATEGORIES
-- ----------------------------
CREATE INDEX "OFFICE_CATEGORIES_PrimaryKey"
ON "OFFICE_CATEGORIES" (
  "c_office_category_id" ASC
);

-- ----------------------------
-- Indexes structure for table OFFICE_CODES
-- ----------------------------
CREATE INDEX "OFFICE_CODES_OFFICE_CODES_SOURCE_TEXT_CODES"
ON "OFFICE_CODES" (
  "c_source" ASC
);
CREATE INDEX "OFFICE_CODES_OFFICE_CODES_dynasty"
ON "OFFICE_CODES" (
  "c_dy" ASC
);
CREATE INDEX "OFFICE_CODES_OFFICE_CODESc_dy"
ON "OFFICE_CODES" (
  "c_dy" ASC
);
CREATE INDEX "OFFICE_CODES_PrimaryKey"
ON "OFFICE_CODES" (
  "c_office_id" ASC
);

-- ----------------------------
-- Indexes structure for table OFFICE_CODES_CONVERSION
-- ----------------------------
CREATE INDEX "OFFICE_CODES_CONVERSION_c_office_id"
ON "OFFICE_CODES_CONVERSION" (
  "c_office_id" ASC
);

-- ----------------------------
-- Indexes structure for table OFFICE_CODE_TYPE_REL
-- ----------------------------
CREATE INDEX "OFFICE_CODE_TYPE_REL_OFFICE_CODE_TYPE_REL_OFFICE_ID"
ON "OFFICE_CODE_TYPE_REL" (
  "c_office_id" ASC
);
CREATE INDEX "OFFICE_CODE_TYPE_REL_OFFICE_CODE_TYPE_REL_OFFICE_TYPE_TREE"
ON "OFFICE_CODE_TYPE_REL" (
  "c_office_tree_id" ASC
);
CREATE INDEX "OFFICE_CODE_TYPE_REL_PrimaryKey"
ON "OFFICE_CODE_TYPE_REL" (
  "c_office_id" ASC,
  "c_office_tree_id" ASC
);
CREATE INDEX "OFFICE_CODE_TYPE_REL_c_office_tree_id"
ON "OFFICE_CODE_TYPE_REL" (
  "c_office_tree_id" ASC
);
CREATE INDEX "OFFICE_CODE_TYPE_REL_code_id"
ON "OFFICE_CODE_TYPE_REL" (
  "c_office_id" ASC
);

-- ----------------------------
-- Indexes structure for table OFFICE_TYPE_TREE
-- ----------------------------
CREATE INDEX "OFFICE_TYPE_TREE_OFFICE_TYPE_TREE_PARENT"
ON "OFFICE_TYPE_TREE" (
  "c_parent_id" ASC
);
CREATE INDEX "OFFICE_TYPE_TREE_PrimaryKey"
ON "OFFICE_TYPE_TREE" (
  "c_office_type_node_id" ASC
);
CREATE INDEX "OFFICE_TYPE_TREE_c_node_id"
ON "OFFICE_TYPE_TREE" (
  "c_office_type_node_id" ASC
);
CREATE INDEX "OFFICE_TYPE_TREE_c_tree_id"
ON "OFFICE_TYPE_TREE" (
  "c_parent_id" ASC
);

-- ----------------------------
-- Indexes structure for table OFFICE_TYPE_TREE_backup
-- ----------------------------
CREATE INDEX "OFFICE_TYPE_TREE_backup_PrimaryKey"
ON "OFFICE_TYPE_TREE_backup" (
  "c_office_type_node_id" ASC
);
CREATE INDEX "OFFICE_TYPE_TREE_backup_c_node_id"
ON "OFFICE_TYPE_TREE_backup" (
  "c_office_type_node_id" ASC
);
CREATE INDEX "OFFICE_TYPE_TREE_backup_c_office_tts_id"
ON "OFFICE_TYPE_TREE_backup" (
  "c_tts_node_id" ASC
);
CREATE INDEX "OFFICE_TYPE_TREE_backup_c_tree_id"
ON "OFFICE_TYPE_TREE_backup" (
  "c_parent_id" ASC
);

-- ----------------------------
-- Indexes structure for table PARENTAL_STATUS_CODES
-- ----------------------------
CREATE INDEX "PARENTAL_STATUS_CODES_PrimaryKey"
ON "PARENTAL_STATUS_CODES" (
  "c_parental_status_code" ASC
);
CREATE INDEX "PARENTAL_STATUS_CODES_c_parental_status_code"
ON "PARENTAL_STATUS_CODES" (
  "c_parental_status_code" ASC
);

-- ----------------------------
-- Indexes structure for table PLACE_CODES
-- ----------------------------
CREATE INDEX "PLACE_CODES_PrimaryKey"
ON "PLACE_CODES" (
  "c_place_id" ASC
);

-- ----------------------------
-- Indexes structure for table POSSESSION_ACT_CODES
-- ----------------------------
CREATE INDEX "POSSESSION_ACT_CODES_PrimaryKey"
ON "POSSESSION_ACT_CODES" (
  "c_possession_act_code" ASC
);
CREATE INDEX "POSSESSION_ACT_CODES_c_possession_type_code"
ON "POSSESSION_ACT_CODES" (
  "c_possession_act_code" ASC
);

-- ----------------------------
-- Indexes structure for table POSSESSION_ADDR
-- ----------------------------
CREATE INDEX "POSSESSION_ADDR_POSSESSION_ADDR_ADDR_ID"
ON "POSSESSION_ADDR" (
  "c_addr_id" ASC
);
CREATE INDEX "POSSESSION_ADDR_POSSESSION_ADDR_PERSON_ID"
ON "POSSESSION_ADDR" (
  "c_personid" ASC
);
CREATE INDEX "POSSESSION_ADDR_POSSESSION_ADDR_possession_id"
ON "POSSESSION_ADDR" (
  "c_possession_record_id" ASC
);
CREATE INDEX "POSSESSION_ADDR_PrimaryKey"
ON "POSSESSION_ADDR" (
  "c_possession_record_id" ASC,
  "c_personid" ASC,
  "c_addr_id" ASC
);
CREATE INDEX "POSSESSION_ADDR_c_addr_id"
ON "POSSESSION_ADDR" (
  "c_addr_id" ASC
);
CREATE INDEX "POSSESSION_ADDR_c_personid"
ON "POSSESSION_ADDR" (
  "c_personid" ASC
);
CREATE INDEX "POSSESSION_ADDR_c_possession_record_id"
ON "POSSESSION_ADDR" (
  "c_possession_record_id" ASC
);

-- ----------------------------
-- Indexes structure for table POSSESSION_DATA
-- ----------------------------
CREATE INDEX "POSSESSION_DATA_POSSESSION_DATA_ADDR_ID"
ON "POSSESSION_DATA" (
  "c_addr_id" ASC
);
CREATE INDEX "POSSESSION_DATA_POSSESSION_DATA_MEASURE_CODE"
ON "POSSESSION_DATA" (
  "c_measure_code" ASC
);
CREATE INDEX "POSSESSION_DATA_POSSESSION_DATA_PERSON_ID"
ON "POSSESSION_DATA" (
  "c_personid" ASC
);
CREATE INDEX "POSSESSION_DATA_POSSESSION_DATA_SOURCE_TEXT_CODE"
ON "POSSESSION_DATA" (
  "c_source" ASC
);
CREATE INDEX "POSSESSION_DATA_POSSESSION_DATA_nian_hao"
ON "POSSESSION_DATA" (
  "c_possession_nh_code" ASC
);
CREATE INDEX "POSSESSION_DATA_POSSESSION_DATA_possession_act_code"
ON "POSSESSION_DATA" (
  "c_possession_act_code" ASC
);
CREATE INDEX "POSSESSION_DATA_POSSESSION_DATA_year_range_code"
ON "POSSESSION_DATA" (
  "c_possession_yr_range" ASC
);
CREATE INDEX "POSSESSION_DATA_POSSESSION_DATAc_measure_code"
ON "POSSESSION_DATA" (
  "c_measure_code" ASC
);
CREATE INDEX "POSSESSION_DATA_POSSESSION_DATAc_possession_act_code"
ON "POSSESSION_DATA" (
  "c_possession_act_code" ASC
);
CREATE INDEX "POSSESSION_DATA_PrimaryKey"
ON "POSSESSION_DATA" (
  "c_possession_record_id" ASC
);
CREATE INDEX "POSSESSION_DATA_c_addr_id"
ON "POSSESSION_DATA" (
  "c_addr_id" ASC
);
CREATE INDEX "POSSESSION_DATA_c_personid"
ON "POSSESSION_DATA" (
  "c_personid" ASC
);
CREATE INDEX "POSSESSION_DATA_c_possession_nh_code"
ON "POSSESSION_DATA" (
  "c_possession_nh_code" ASC
);

-- ----------------------------
-- Indexes structure for table POSTED_TO_ADDR_DATA
-- ----------------------------
CREATE INDEX "POSTED_TO_ADDR_DATA_POSTED_TO_ADDR_DATA_ADDR_ID"
ON "POSTED_TO_ADDR_DATA" (
  "c_addr_id" ASC
);
CREATE INDEX "POSTED_TO_ADDR_DATA_POSTED_TO_ADDR_DATA_OFFICE_ID"
ON "POSTED_TO_ADDR_DATA" (
  "c_office_id" ASC
);
CREATE INDEX "POSTED_TO_ADDR_DATA_POSTED_TO_ADDR_DATA_PERSON_ID"
ON "POSTED_TO_ADDR_DATA" (
  "c_personid" ASC
);
CREATE INDEX "POSTED_TO_ADDR_DATA_POSTED_TO_ADDR_DATA_POSTING_ID"
ON "POSTED_TO_ADDR_DATA" (
  "c_posting_id" ASC
);
CREATE INDEX "POSTED_TO_ADDR_DATA_POSTED_TO_ADDR_DATAc_addr_id"
ON "POSTED_TO_ADDR_DATA" (
  "c_addr_id" ASC
);
CREATE INDEX "POSTED_TO_ADDR_DATA_POSTING_ADDR_DATAc_posting_id"
ON "POSTED_TO_ADDR_DATA" (
  "c_posting_id" ASC
);
CREATE INDEX "POSTED_TO_ADDR_DATA_PrimaryKey"
ON "POSTED_TO_ADDR_DATA" (
  "c_posting_id" ASC,
  "c_addr_id" ASC,
  "c_office_id" ASC
);

-- ----------------------------
-- Indexes structure for table POSTED_TO_OFFICE_DATA
-- ----------------------------
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_GANZHI_FY_DAY"
ON "POSTED_TO_OFFICE_DATA" (
  "c_fy_day_gz" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_GANZHI_LY_DAY"
ON "POSTED_TO_OFFICE_DATA" (
  "c_ly_day_gz" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_OFFICE_CATEGORY"
ON "POSTED_TO_OFFICE_DATA" (
  "c_office_category_id" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_OFFICE_ID"
ON "POSTED_TO_OFFICE_DATA" (
  "c_office_id" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_PERSON_ID"
ON "POSTED_TO_OFFICE_DATA" (
  "c_personid" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_POSTING_ID"
ON "POSTED_TO_OFFICE_DATA" (
  "c_posting_id" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_SOCIAL_INSTITUTION_CODE"
ON "POSTED_TO_OFFICE_DATA" (
  "c_inst_name_code" ASC,
  "c_inst_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_SOCIAL_INSTITUTION_NAME_CODE"
ON "POSTED_TO_OFFICE_DATA" (
  "c_inst_name_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_SOURCE_TEXT_CODE"
ON "POSTED_TO_OFFICE_DATA" (
  "c_source" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_appointment_type_code"
ON "POSTED_TO_OFFICE_DATA" (
  "c_appt_type_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_assume_office_code"
ON "POSTED_TO_OFFICE_DATA" (
  "c_assume_office_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_dynasty"
ON "POSTED_TO_OFFICE_DATA" (
  "c_dy" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_nian_hao_fy"
ON "POSTED_TO_OFFICE_DATA" (
  "c_fy_nh_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_nian_hao_ly"
ON "POSTED_TO_OFFICE_DATA" (
  "c_ly_nh_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_year_range_fy"
ON "POSTED_TO_OFFICE_DATA" (
  "c_fy_range" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATA_year_range_ly"
ON "POSTED_TO_OFFICE_DATA" (
  "c_ly_range" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTED_TO_OFFICE_DATAc_dy"
ON "POSTED_TO_OFFICE_DATA" (
  "c_dy" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POSTING_OFFICE_DATAc_posting_id"
ON "POSTED_TO_OFFICE_DATA" (
  "c_posting_id" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_POST_DATAc_appt_type_code"
ON "POSTED_TO_OFFICE_DATA" (
  "c_appt_type_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_PrimaryKey"
ON "POSTED_TO_OFFICE_DATA" (
  "c_office_id" ASC,
  "c_posting_id" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_c_assume_office_code"
ON "POSTED_TO_OFFICE_DATA" (
  "c_assume_office_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_c_fy_nh_code"
ON "POSTED_TO_OFFICE_DATA" (
  "c_fy_nh_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_c_inst_code"
ON "POSTED_TO_OFFICE_DATA" (
  "c_inst_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_c_inst_name_code"
ON "POSTED_TO_OFFICE_DATA" (
  "c_inst_name_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_c_ly_nh_code"
ON "POSTED_TO_OFFICE_DATA" (
  "c_ly_nh_code" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_c_office_category_id"
ON "POSTED_TO_OFFICE_DATA" (
  "c_office_category_id" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_c_office_id"
ON "POSTED_TO_OFFICE_DATA" (
  "c_office_id" ASC
);
CREATE INDEX "POSTED_TO_OFFICE_DATA_c_personid"
ON "POSTED_TO_OFFICE_DATA" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table POSTING_DATA
-- ----------------------------
CREATE INDEX "POSTING_DATA_POSTING_DATA_PERSON_ID"
ON "POSTING_DATA" (
  "c_personid" ASC
);
CREATE INDEX "POSTING_DATA_PrimaryKey"
ON "POSTING_DATA" (
  "c_posting_id" ASC
);
CREATE INDEX "POSTING_DATA_c_personid"
ON "POSTING_DATA" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table SCHOLARLYTOPIC_CODES
-- ----------------------------
CREATE INDEX "SCHOLARLYTOPIC_CODES_PrimaryKey"
ON "SCHOLARLYTOPIC_CODES" (
  "c_topic_code" ASC
);
CREATE INDEX "SCHOLARLYTOPIC_CODES_c_topic_code"
ON "SCHOLARLYTOPIC_CODES" (
  "c_topic_code" ASC
);
CREATE INDEX "SCHOLARLYTOPIC_CODES_c_topic_type_code"
ON "SCHOLARLYTOPIC_CODES" (
  "c_topic_type_code" ASC
);

-- ----------------------------
-- Indexes structure for table SOCIAL_INSTITUTION_ADDR
-- ----------------------------
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_PrimaryKey"
ON "SOCIAL_INSTITUTION_ADDR" (
  "c_inst_name_code" ASC,
  "c_inst_code" ASC,
  "c_inst_addr_type_code" ASC,
  "inst_xcoord" ASC,
  "inst_ycoord" ASC,
  "c_inst_addr_id" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_SOCIAL_INSTITUTION_ADDR_ADDR_ID"
ON "SOCIAL_INSTITUTION_ADDR" (
  "c_inst_addr_id" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_SOCIAL_INSTITUTION_ADDR_SOCIAL_INSTITUTION_CODE"
ON "SOCIAL_INSTITUTION_ADDR" (
  "c_inst_name_code" ASC,
  "c_inst_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_SOCIAL_INSTITUTION_ADDR_TEXT_CODES"
ON "SOCIAL_INSTITUTION_ADDR" (
  "c_source" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_SOCIAL_INSTITUTION_ADDR_TYPE"
ON "SOCIAL_INSTITUTION_ADDR" (
  "c_inst_addr_type_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_c_inst_addr_id"
ON "SOCIAL_INSTITUTION_ADDR" (
  "c_inst_addr_id" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_c_inst_addr_type_id"
ON "SOCIAL_INSTITUTION_ADDR" (
  "c_inst_addr_type_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_c_inst_name_code"
ON "SOCIAL_INSTITUTION_ADDR" (
  "c_inst_name_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_c_new_code"
ON "SOCIAL_INSTITUTION_ADDR" (
  "c_inst_code" ASC
);

-- ----------------------------
-- Indexes structure for table SOCIAL_INSTITUTION_ADDR_TYPES
-- ----------------------------
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_TYPES_PrimaryKey"
ON "SOCIAL_INSTITUTION_ADDR_TYPES" (
  "c_inst_addr_type_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ADDR_TYPES_c_inst_addr_type_id"
ON "SOCIAL_INSTITUTION_ADDR_TYPES" (
  "c_inst_addr_type_code" ASC
);

-- ----------------------------
-- Indexes structure for table SOCIAL_INSTITUTION_ALTNAME_CODES
-- ----------------------------
CREATE INDEX "SOCIAL_INSTITUTION_ALTNAME_CODES_PrimaryKey"
ON "SOCIAL_INSTITUTION_ALTNAME_CODES" (
  "c_inst_altname_type" ASC
);

-- ----------------------------
-- Indexes structure for table SOCIAL_INSTITUTION_ALTNAME_DATA
-- ----------------------------
CREATE INDEX "SOCIAL_INSTITUTION_ALTNAME_DATA_PrimaryKey"
ON "SOCIAL_INSTITUTION_ALTNAME_DATA" (
  "c_inst_name_code" ASC,
  "c_inst_code" ASC,
  "c_inst_altname_type" ASC,
  "c_inst_altname_hz" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ALTNAME_DATA_c_inst_altname_type_id"
ON "SOCIAL_INSTITUTION_ALTNAME_DATA" (
  "c_inst_altname_type" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ALTNAME_DATA_c_inst_code"
ON "SOCIAL_INSTITUTION_ALTNAME_DATA" (
  "c_inst_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_ALTNAME_DATA_c_inst_name_code"
ON "SOCIAL_INSTITUTION_ALTNAME_DATA" (
  "c_inst_name_code" ASC
);

-- ----------------------------
-- Indexes structure for table SOCIAL_INSTITUTION_CODES
-- ----------------------------
CREATE INDEX "SOCIAL_INSTITUTION_CODES_PrimaryKey"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_inst_name_code" ASC,
  "c_inst_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_CODES_DYNASTY_BEGIN"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_inst_begin_dy" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_CODES_DYNASTY_END"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_inst_floruit_dy" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_CODES_NIAN_HAO_BY"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_by_nianhao_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_CODES_NIAN_HAO_EY"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_ey_nianhao_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_NAME_CODE"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_inst_name_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_TYPE_CODE"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_inst_type_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_CODES_SOURCE_TEXT_ID"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_source" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_CODES_YEAR_RANGE_CODE_BY"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_by_year_range" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_SOCIAL_INSTITUTION_CODES_YEAR_RANGE_CODE_EY"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_ey_year_range" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_c_ey_nianhao_code"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_ey_nianhao_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_c_inst_name_code"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_inst_name_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_c_institution_type_code"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_inst_type_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_c_new_code"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_inst_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_c_nianhao_code"
ON "SOCIAL_INSTITUTION_CODES" (
  "c_by_nianhao_code" ASC
);

-- ----------------------------
-- Indexes structure for table SOCIAL_INSTITUTION_CODES_CONVERSION
-- ----------------------------
CREATE INDEX "SOCIAL_INSTITUTION_CODES_CONVERSION_PrimaryKey"
ON "SOCIAL_INSTITUTION_CODES_CONVERSION" (
  "c_inst_name_code" ASC,
  "c_inst_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_CONVERSION_c_inst_name_code"
ON "SOCIAL_INSTITUTION_CODES_CONVERSION" (
  "c_inst_name_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_CONVERSION_c_institution_code"
ON "SOCIAL_INSTITUTION_CODES_CONVERSION" (
  "c_inst_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_CODES_CONVERSION_c_new_new_code"
ON "SOCIAL_INSTITUTION_CODES_CONVERSION" (
  "c_new_new_code" ASC
);

-- ----------------------------
-- Indexes structure for table SOCIAL_INSTITUTION_NAME_CODES
-- ----------------------------
CREATE INDEX "SOCIAL_INSTITUTION_NAME_CODES_PrimaryKey"
ON "SOCIAL_INSTITUTION_NAME_CODES" (
  "c_inst_name_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_NAME_CODES_c_inst_name_code"
ON "SOCIAL_INSTITUTION_NAME_CODES" (
  "c_inst_name_code" ASC
);

-- ----------------------------
-- Indexes structure for table SOCIAL_INSTITUTION_TYPES
-- ----------------------------
CREATE INDEX "SOCIAL_INSTITUTION_TYPES_PrimaryKey"
ON "SOCIAL_INSTITUTION_TYPES" (
  "c_inst_type_code" ASC
);
CREATE INDEX "SOCIAL_INSTITUTION_TYPES_c_institution_type_code"
ON "SOCIAL_INSTITUTION_TYPES" (
  "c_inst_type_code" ASC
);

-- ----------------------------
-- Indexes structure for table STATUS_CODES
-- ----------------------------
CREATE INDEX "STATUS_CODES_PrimaryKey"
ON "STATUS_CODES" (
  "c_status_code" ASC
);

-- ----------------------------
-- Indexes structure for table STATUS_CODE_TYPE_REL
-- ----------------------------
CREATE INDEX "STATUS_CODE_TYPE_REL_PrimaryKey"
ON "STATUS_CODE_TYPE_REL" (
  "c_status_code" ASC,
  "c_status_type_code" ASC
);
CREATE INDEX "STATUS_CODE_TYPE_REL_STATUS_CODE_TYPE_REL_STATUS_CODE"
ON "STATUS_CODE_TYPE_REL" (
  "c_status_code" ASC
);
CREATE INDEX "STATUS_CODE_TYPE_REL_STATUS_CODE_TYPE_REL_STATUS_TYPE"
ON "STATUS_CODE_TYPE_REL" (
  "c_status_type_code" ASC
);
CREATE INDEX "STATUS_CODE_TYPE_REL_c_status_code"
ON "STATUS_CODE_TYPE_REL" (
  "c_status_code" ASC
);
CREATE INDEX "STATUS_CODE_TYPE_REL_c_status_type_code"
ON "STATUS_CODE_TYPE_REL" (
  "c_status_type_code" ASC
);

-- ----------------------------
-- Indexes structure for table STATUS_DATA
-- ----------------------------
CREATE INDEX "STATUS_DATA_PrimaryKey"
ON "STATUS_DATA" (
  "c_personid" ASC,
  "c_sequence" ASC,
  "c_status_code" ASC
);
CREATE INDEX "STATUS_DATA_STATUS_DATA_PERSON_ID"
ON "STATUS_DATA" (
  "c_personid" ASC
);
CREATE INDEX "STATUS_DATA_STATUS_DATA_SOURCE_TEXT_ID"
ON "STATUS_DATA" (
  "c_source" ASC
);
CREATE INDEX "STATUS_DATA_STATUS_DATA_STATUS_CODES"
ON "STATUS_DATA" (
  "c_status_code" ASC
);
CREATE INDEX "STATUS_DATA_STATUS_DATA_nian_hao_fy"
ON "STATUS_DATA" (
  "c_fy_nh_code" ASC
);
CREATE INDEX "STATUS_DATA_STATUS_DATA_nian_hao_ly"
ON "STATUS_DATA" (
  "c_ly_nh_code" ASC
);
CREATE INDEX "STATUS_DATA_STATUS_DATA_year_range_code_fy"
ON "STATUS_DATA" (
  "c_fy_range" ASC
);
CREATE INDEX "STATUS_DATA_STATUS_DATA_year_range_code_ly"
ON "STATUS_DATA" (
  "c_ly_range" ASC
);
CREATE INDEX "STATUS_DATA_c_fy_nh_code"
ON "STATUS_DATA" (
  "c_fy_nh_code" ASC
);
CREATE INDEX "STATUS_DATA_c_ly_nh_code"
ON "STATUS_DATA" (
  "c_ly_nh_code" ASC
);
CREATE INDEX "STATUS_DATA_c_personid"
ON "STATUS_DATA" (
  "c_personid" ASC
);
CREATE INDEX "STATUS_DATA_c_status_code"
ON "STATUS_DATA" (
  "c_status_code" ASC
);

-- ----------------------------
-- Indexes structure for table STATUS_TYPES
-- ----------------------------
CREATE INDEX "STATUS_TYPES_PrimaryKey"
ON "STATUS_TYPES" (
  "c_status_type_code" ASC
);
CREATE INDEX "STATUS_TYPES_c_status_type_code"
ON "STATUS_TYPES" (
  "c_status_type_code" ASC
);
CREATE INDEX "STATUS_TYPES_c_status_type_parent_code"
ON "STATUS_TYPES" (
  "c_status_type_parent_code" ASC
);

-- ----------------------------
-- Indexes structure for table TEXT_BIBLCAT_CODES
-- ----------------------------
CREATE INDEX "TEXT_BIBLCAT_CODES_PrimaryKey"
ON "TEXT_BIBLCAT_CODES" (
  "c_text_cat_code" ASC
);
CREATE INDEX "TEXT_BIBLCAT_CODES_c_genre_code"
ON "TEXT_BIBLCAT_CODES" (
  "c_text_cat_code" ASC
);
CREATE INDEX "TEXT_BIBLCAT_CODES_c_text_cat_parent_id"
ON "TEXT_BIBLCAT_CODES" (
  "c_text_cat_parent_id" ASC
);

-- ----------------------------
-- Indexes structure for table TEXT_BIBLCAT_CODE_TYPE_REL
-- ----------------------------
CREATE INDEX "TEXT_BIBLCAT_CODE_TYPE_REL_PrimaryKey"
ON "TEXT_BIBLCAT_CODE_TYPE_REL" (
  "c_text_cat_code" ASC,
  "c_text_cat_type_id" ASC
);
CREATE INDEX "TEXT_BIBLCAT_CODE_TYPE_REL_TEXT_BIBLCAT_CODE_TYPE_REL_TEXT_CAT_CODE"
ON "TEXT_BIBLCAT_CODE_TYPE_REL" (
  "c_text_cat_code" ASC
);
CREATE INDEX "TEXT_BIBLCAT_CODE_TYPE_REL_TEXT_BIBLCAT_CODE_TYPE_REL_TEXT_CAT_TYPE"
ON "TEXT_BIBLCAT_CODE_TYPE_REL" (
  "c_text_cat_type_id" ASC
);
CREATE INDEX "TEXT_BIBLCAT_CODE_TYPE_REL_code_id"
ON "TEXT_BIBLCAT_CODE_TYPE_REL" (
  "c_text_cat_code" ASC
);
CREATE INDEX "TEXT_BIBLCAT_CODE_TYPE_REL_type_id"
ON "TEXT_BIBLCAT_CODE_TYPE_REL" (
  "c_text_cat_type_id" ASC
);

-- ----------------------------
-- Indexes structure for table TEXT_BIBLCAT_TYPES
-- ----------------------------
CREATE INDEX "TEXT_BIBLCAT_TYPES_PrimaryKey"
ON "TEXT_BIBLCAT_TYPES" (
  "c_text_cat_type_id" ASC
);
CREATE INDEX "TEXT_BIBLCAT_TYPES_type_id"
ON "TEXT_BIBLCAT_TYPES" (
  "c_text_cat_type_id" ASC
);
CREATE INDEX "TEXT_BIBLCAT_TYPES_type_parent_id"
ON "TEXT_BIBLCAT_TYPES" (
  "c_text_cat_type_parent_id" ASC
);

-- ----------------------------
-- Indexes structure for table TEXT_CODES
-- ----------------------------
CREATE INDEX "TEXT_CODES_PrimaryKey"
ON "TEXT_CODES" (
  "c_textid" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_COUNTRY_CODE_PUB"
ON "TEXT_CODES" (
  "c_pub_country" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_COUNTRY_CODE_TEXT"
ON "TEXT_CODES" (
  "c_text_country" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_DYNASTY_PUB"
ON "TEXT_CODES" (
  "c_pub_dy" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_DYNASTY_TEXT"
ON "TEXT_CODES" (
  "c_text_dy" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_EXTANT_CODE"
ON "TEXT_CODES" (
  "c_extant" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_NIAN_HAO_PUB"
ON "TEXT_CODES" (
  "c_pub_nh_code" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_NIAN_HAO_TEXT"
ON "TEXT_CODES" (
  "c_text_nh_code" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_SOURCE_TEXT_ID"
ON "TEXT_CODES" (
  "c_source" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_TEXT_BIBLCAT_CODE"
ON "TEXT_CODES" (
  "c_bibl_cat_code" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_YEAR_RANGE_CODE_PUB"
ON "TEXT_CODES" (
  "c_pub_range_code" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODES_YEAR_RANGE_CODE_TEXT"
ON "TEXT_CODES" (
  "c_text_range_code" ASC
);
CREATE INDEX "TEXT_CODES_TEXT_CODESc_source"
ON "TEXT_CODES" (
  "c_source" ASC
);
CREATE INDEX "TEXT_CODES_c_genre_code"
ON "TEXT_CODES" (
  "c_bibl_cat_code" ASC
);
CREATE INDEX "TEXT_CODES_c_text_nh_code"
ON "TEXT_CODES" (
  "c_text_nh_code" ASC
);
CREATE INDEX "TEXT_CODES_c_text_range_code"
ON "TEXT_CODES" (
  "c_text_range_code" ASC
);
CREATE INDEX "TEXT_CODES_c_text_type_code"
ON "TEXT_CODES" (
  "c_text_type_id" ASC
);
CREATE INDEX "TEXT_CODES_c_textid"
ON "TEXT_CODES" (
  "c_textid" ASC
);

-- ----------------------------
-- Indexes structure for table TEXT_INSTANCE_DATA
-- ----------------------------
CREATE INDEX "TEXT_INSTANCE_DATA_PrimaryKey"
ON "TEXT_INSTANCE_DATA" (
  "c_textid" ASC,
  "c_text_edition_id" ASC,
  "c_text_instance_id" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_TEXT_INSTANCE_COUNTRY"
ON "TEXT_INSTANCE_DATA" (
  "c_pub_country" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_TEXT_INSTANCE_PUB_DYNASTY"
ON "TEXT_INSTANCE_DATA" (
  "c_pub_dy" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_TEXT_INSTANCE_PUB_NIANHAO"
ON "TEXT_INSTANCE_DATA" (
  "c_pub_nh_code" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_TEXT_INSTANCE_PUB_RANGE"
ON "TEXT_INSTANCE_DATA" (
  "c_pub_range_code" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_TEXT_INSTANCE_SOURCE_ID"
ON "TEXT_INSTANCE_DATA" (
  "c_source" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_TEXT_INSTANCE_TEXT_ID"
ON "TEXT_INSTANCE_DATA" (
  "c_textid" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_c_pub_nh_code"
ON "TEXT_INSTANCE_DATA" (
  "c_pub_nh_code" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_c_pub_range_code"
ON "TEXT_INSTANCE_DATA" (
  "c_pub_range_code" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_c_text_edition_id"
ON "TEXT_INSTANCE_DATA" (
  "c_text_edition_id" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_c_text_instance_id"
ON "TEXT_INSTANCE_DATA" (
  "c_text_instance_id" ASC
);
CREATE INDEX "TEXT_INSTANCE_DATA_c_textid"
ON "TEXT_INSTANCE_DATA" (
  "c_textid" ASC
);

-- ----------------------------
-- Indexes structure for table TEXT_ROLE_CODES
-- ----------------------------
CREATE INDEX "TEXT_ROLE_CODES_PrimaryKey"
ON "TEXT_ROLE_CODES" (
  "c_role_id" ASC
);
CREATE INDEX "TEXT_ROLE_CODES_c_role_id"
ON "TEXT_ROLE_CODES" (
  "c_role_id" ASC
);

-- ----------------------------
-- Indexes structure for table TEXT_TYPE
-- ----------------------------
CREATE INDEX "TEXT_TYPE_c_text_type_code"
ON "TEXT_TYPE" (
  "c_text_type_code" ASC
);
CREATE INDEX "TEXT_TYPE_c_text_type_parent_id"
ON "TEXT_TYPE" (
  "c_text_type_parent_id" ASC
);

-- ----------------------------
-- Indexes structure for table TMP_INDEX_YEAR
-- ----------------------------
CREATE INDEX "TMP_INDEX_YEAR_PrimaryKey"
ON "TMP_INDEX_YEAR" (
  "c_personid" ASC
);
CREATE INDEX "TMP_INDEX_YEAR_c_index_year_source_id"
ON "TMP_INDEX_YEAR" (
  "c_index_year_source_id" ASC
);
CREATE INDEX "TMP_INDEX_YEAR_c_personid"
ON "TMP_INDEX_YEAR" (
  "c_personid" ASC
);

-- ----------------------------
-- Indexes structure for table TablesFields
-- ----------------------------
CREATE INDEX "TablesFields_ForeignKey"
ON "TablesFields" (
  "ForeignKey" ASC
);
CREATE INDEX "TablesFields_PrimaryKey"
ON "TablesFields" (
  "AccessTblNm" ASC,
  "AccessFldNm" ASC
);
CREATE INDEX "TablesFields_RowNum"
ON "TablesFields" (
  "RowNum" ASC
);

-- ----------------------------
-- Indexes structure for table TablesFieldsChanges
-- ----------------------------
CREATE INDEX "TablesFieldsChanges_Change"
ON "TablesFieldsChanges" (
  "TableName" ASC,
  "FieldName" ASC,
  "Change" ASC
);

-- ----------------------------
-- Indexes structure for table YEAR_RANGE_CODES
-- ----------------------------
CREATE INDEX "YEAR_RANGE_CODES_PrimaryKey"
ON "YEAR_RANGE_CODES" (
  "c_range_code" ASC
);
CREATE INDEX "YEAR_RANGE_CODES_c_range_code"
ON "YEAR_RANGE_CODES" (
  "c_range_code" ASC
);

PRAGMA foreign_keys = true;
