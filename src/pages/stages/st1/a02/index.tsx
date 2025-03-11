import React from "react";
import { useTranslation } from "react-i18next";
import { a02Validate } from "../../../../utils/validateForm";
import { Review } from "../../../../components/Review";

type A02Type = {
  text: string;
};

type A02ErrorsType = {
  text?: string;
};

export const A02: React.FC = () => {
  const { t } = useTranslation();
  // const { activityRef } = useOutletContext<{
  //   activityRef: React.MutableRefObject<ActivityHandle | null>;
  // }>();

  // const [a02Data, setA02Data] = useState<A02Type>({
  //   text: "",
  // });
  // const [errors, setErrors] = useState<A02ErrorsType>({});

  // const validateForm = useCallback(async () => {
  //   try {
  //     await a02Validate.validate(a02Data, { abortEarly: false });
  //     setErrors({});
  //     return true;
  //   } catch (err: any) {
  //     console.log("error", err);
  //     if (err.inner) {
  //       const validationErrors: { [key: string]: string } = {};
  //       err.inner.forEach((error: any) => {
  //         if (error.path) validationErrors[error.path] = error.message;
  //       });
  //       setErrors(validationErrors);
  //     }
  //     return false;
  //   }
  // }, [a02Data]);

  // useEffect(() => {
  //   if (activityRef) {
  //     activityRef.current = { validateForm };
  //   }
  // }, [activityRef, a02Data, validateForm]);

  return (
    <Review
      label={t("organization-elements")}
      validationSchema={a02Validate}
    />
    // <Box component="form" display="flex" flexDirection="column" gap={2}>
    //   <Typography variant="subtitle2">{t("organization-elements")}</Typography>
    //   <TextField
    //     variant="outlined"
    //     value={a02Data.text}
    //     multiline
    //     rows={16}
    //     onChange={(e) => {
    //       setA02Data((prev) => ({ ...prev, text: e.target.value }));
    //       if (errors.text) {
    //         setErrors((prev) => ({ ...prev, text: undefined }));
    //       }
    //     }}
    //     error={!!errors.text}
    //     helperText={errors.text}
    //     sx={{
    //       "& .MuiInputBase-inputMultiline": {
    //         resize: "vertical",
    //       },
    //     }}
    //   />
    // </Box>
  );
};
