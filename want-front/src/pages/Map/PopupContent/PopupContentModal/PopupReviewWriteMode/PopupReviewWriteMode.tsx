import { Fragment, useEffect, useState } from "react";
import "./PopupReviewWriteMode.css";
import { useReviewsStore, type ReviewType } from "../../../../../store/reviews";
import { useRouteLoaderData } from "react-router";
import { jwtDecoder } from "../../../../Auth/Auth_utils";
import Button from "../../../../../atoms/Button/Button";
import StarRating from "./StarRating/StarRating";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import ValidationError from "../../../../../atoms/ValidationError/ValidationError";
import { useTranslation } from "react-i18next";

type PopupReviewWriteModeType = {
  setSubmitReviewMsg?: React.Dispatch<
    React.SetStateAction<string | undefined | null>
  >;
  osmId: number;
  review?: ReviewType;
};

const reviewSchema = z.object({
  comment: z
    .string({
      required_error: "ⓧ Comment is required.",
    })
    .min(5, { message: "ⓧ Comment must be at least 5 characters." })
    .max(500, { message: "ⓧ Comment must be at most 500 characters." }),

  rating: z
    .number({
      required_error: "ⓧ Rating is required.",
      invalid_type_error: "ⓧ Rating must be a number.",
    })
    .min(1, { message: "ⓧ Rating must be at least 1." })
    .max(5, { message: "ⓧ Rating must be at most 5." }),
});

type FormFieldType = z.infer<typeof reviewSchema>;

const PopupReviewWriteMode = ({
  setSubmitReviewMsg = () => {},
  osmId,
  review,
}: PopupReviewWriteModeType) => {
  const {
    submitReview,
    isLoading,
    editReview,
    setEditingReview,
    editingReview,
    setIsWriteMode,
  } = useReviewsStore();
  const { t } = useTranslation();
  const [hovered, setHovered] = useState<number | null>(null);
  const token = useRouteLoaderData("root") as string | null;
  const decodedToken = jwtDecoder(token);
  const userId = decodedToken?.userId;
  const [serverError, setServerError] = useState<string | undefined | null>();
  const {
    register, // link to inputs ( = name )
    formState: { errors },
    setValue,
    handleSubmit,
    clearErrors,
    reset,
    watch,
  } = useForm<FormFieldType>({
    resolver: zodResolver(reviewSchema), // validation
    defaultValues: {
      comment: review?.comment ?? "",
      rating: review?.rating ?? 0,
    },
    mode: "onSubmit",
  });

  const selectedRating = watch("rating");

  /**
   * for rating
   */
  useEffect(() => {
    setValue("rating", review?.rating ?? 0);
  }, [review?.rating, setValue]);

  /**
   * pre filled in edit mode
   */
  useEffect(() => {
    if (editingReview) {
      setValue("comment", editingReview.comment);
      setValue("rating", editingReview.rating);
    }
  }, [editingReview, setValue]);

  /**
   * POST review
   */
  const handleCreateAndEditReview = async (fd: FormFieldType) => {
    clearErrors();
    setSubmitReviewMsg(null);
    setServerError(null);

    const newReview: ReviewType = {
      ...(editingReview?.id ? { id: editingReview.id } : {}),
      osmId,
      userId,
      comment: fd.comment,
      rating: fd.rating,
      timeStamp: new Date().toISOString(),
      likeCount: review?.likeCount ?? 0,
    };

    const result = await (editingReview
      ? editReview(newReview, token)
      : submitReview(newReview, token));

    if (result.isSuccess) {
      // console.log(result, "succeed");

      setSubmitReviewMsg(result.message);
      setIsWriteMode(false);
      if (!editingReview) {
        reset();
      }
      setHovered(null);
    } else {
      setServerError(result.message);
    }
  };

  const cancelHandler = () => {
    setIsWriteMode(false);
    setEditingReview(null);
  };

  return (
    <Fragment>
      <form
        onSubmit={handleSubmit(handleCreateAndEditReview)} // validation with handleSubmit -> call handleCreateAndEditReview(formData)
        className="PopupReviewWriteMode"
      >
        <p className="PopupReviewWriteMode__reviewFormTitle">
          {t("share-review")}
        </p>
        <p className="PopupReviewWriteMode__reviewDescription">
          {t("share-review-description")}
        </p>
        <p className="PopupReviewWriteMode__reviewDescription">
          {t("share-review-incitement")}
        </p>
        <div className="PopupReviewWriteMode__reviewFormInput">
          <StarRating
            hovered={hovered}
            selected={selectedRating}
            setHovered={setHovered}
            setSelected={(val: number) => setValue("rating", val)}
            register={{ ...register("rating", { valueAsNumber: true }) }}
          />
          <textarea id="comment" {...register("comment")} />
        </div>
        <div className="PopupReviewWriteMode__reviewFormButtonContainer">
          <Button
            variant="inverted"
            disabled={isLoading}
            buttonTxt={isLoading ? t("submitting") : t("submit")}
            type="submit"
          />
          <Button
            disabled={isLoading}
            onClick={cancelHandler}
            buttonTxt={t("cancel")}
            variant="primary"
            type="button"
          />
        </div>
        {serverError && (
          <p className="PopupReviewWriteMode__submitError">{serverError}</p>
        )}
        <div className="PopupReviewWriteMode__errorWrapper">
          <ValidationError errors={errors.rating} />
          <ValidationError errors={errors.comment} />
        </div>
      </form>
    </Fragment>
  );
};

export default PopupReviewWriteMode;
