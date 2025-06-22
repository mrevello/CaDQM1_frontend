import * as yup from "yup";
import { ContextComponentType } from "../types/contextComponent";

export const ApplicationDomainValidate = yup.object().shape({
  description: yup.string().trim().required("This field is mandatory"),
});

export const BusinessRuleValidate = yup.object().shape({
  statement: yup.string().trim().required("This field is mandatory"),
  semantic: yup.string().trim().required("This field is mandatory"),
});

export const DataFilteringValidate = yup.object().shape({
  statement: yup.string().trim().required("This field is mandatory"),
  task_at_hand: yup.string().trim().required("This field is mandatory"),
});

export const DQMetadataValidate = yup.object().shape({
  path: yup.string().trim().required("This field is mandatory"),
  measurement: yup.string().trim().required("This field is mandatory"),
});

export const DQRequirementValidate = yup.object().shape({
  statement: yup.string().trim().required("This field is mandatory"),
  description: yup.string().trim().required("This field is mandatory"),
  user_type: yup.string().trim().required("This field is mandatory"),
});

export const OtherDataValidate = yup.object().shape({
  path: yup.string().trim().required("This field is mandatory"),
  owner: yup.string().trim().required("This field is mandatory"),
  description: yup.string().trim().required("This field is mandatory"),
});

export const OtherMetadataValidate = yup.object().shape({
  path: yup.string().trim().required("This field is mandatory"),
  description: yup.string().trim().required("This field is mandatory"),
  author: yup.string().trim().required("This field is mandatory"),
});

export const SystemRequirementValidate = yup.object().shape({
  statement: yup.string().trim().required("This field is mandatory"),
  description: yup.string().trim().required("This field is mandatory"),
});

export const TaskAtHandValidate = yup.object().shape({
  name: yup.string().trim().required("This field is mandatory"),
  purpose: yup.string().trim().required("This field is mandatory"),
});

export const UserTypeValidate = yup.object().shape({
  name: yup.string().trim().required("This field is mandatory"),
  characteristics: yup.string().trim().required("This field is mandatory"),
});

export const ContextComponentValidators = {
  [ContextComponentType.APPLICATION_DOMAIN]: ApplicationDomainValidate,
  [ContextComponentType.BUSINESS_RULE]: BusinessRuleValidate,
  [ContextComponentType.DATA_FILTERING]: DataFilteringValidate,
  [ContextComponentType.DQ_METADATA]: DQMetadataValidate,
  [ContextComponentType.DQ_REQUIREMENT]: DQRequirementValidate,
  [ContextComponentType.OTHER_DATA]: OtherDataValidate,
  [ContextComponentType.OTHER_METADATA]: OtherMetadataValidate,
  [ContextComponentType.SYSTEM_REQUIREMENT]: SystemRequirementValidate,
  [ContextComponentType.TASK_AT_HAND]: TaskAtHandValidate,
  [ContextComponentType.USER_TYPE]: UserTypeValidate,
};
