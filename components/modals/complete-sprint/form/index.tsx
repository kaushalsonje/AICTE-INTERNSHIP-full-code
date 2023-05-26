import { Button } from "@/components/ui/button";
import { type Sprint } from "@prisma/client";
import { type FieldError, useForm } from "react-hook-form";
import { Spinner } from "@/components/ui/spinner";
import { SprintDropdownField } from "./fields/sprint-dropdown";
import { useIssues } from "@/hooks/useIssues";
import { type IssueType } from "@/utils/types";
import { isDone } from "@/utils/helpers";
import { useSprints } from "@/hooks/useSprints";

export type FormValues = {
  moveToSprintId: string;
};

const CompleteSprintForm: React.FC<{
  sprint: Sprint;
  issues: IssueType[];
  setModalIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ sprint, setModalIsOpen, issues }) => {
  const {
    handleSubmit,
    formState: { errors },
    control,
    reset,
  } = useForm<FormValues>({
    defaultValues: {
      moveToSprintId: "backlog",
    },
  });

  const { updateSprint, isUpdating } = useSprints();

  const { updateIssuesBatch, batchUpdating } = useIssues();

  function handleCompleteSprint(data: FormValues) {
    updateSprint(
      {
        sprintId: sprint.id,
        status: "CLOSED",
      },
      {
        onSuccess: () => {
          handleClose();
        },
      }
    );
    updateIssuesBatch({
      keys:
        issues?.filter((issue) => isDone(issue)).map((issue) => issue.key) ??
        [],
      sprintId: data.moveToSprintId === "backlog" ? null : data.moveToSprintId,
    });
  }

  function handleClose() {
    reset();
    setModalIsOpen(false);
  }

  return (
    <form
      // eslint-disable-next-line
      onSubmit={handleSubmit(handleCompleteSprint)}
      className="relative h-full"
    >
      <SprintDropdownField control={control} errors={errors} />
      <div className="flex w-full justify-end">
        <Button
          customColors
          customPadding
          className="flex items-center gap-x-2 bg-inprogress px-3 py-1.5 font-medium text-white"
          type="submit"
          name="complete"
          disabled={isUpdating || batchUpdating}
          aria-label={"complete"}
        >
          <span>Complete</span>
          {isUpdating || batchUpdating ? <Spinner white size="sm" /> : null}
        </Button>
        <Button
          customColors
          customPadding
          onClick={handleClose}
          className="px-3 py-1.5 font-medium text-inprogress underline-offset-2 hover:underline hover:brightness-110"
          name="cancel"
          aria-label={"cancel"}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

const Label: React.FC<
  { text: string; required?: boolean } & React.HTMLProps<HTMLLabelElement>
> = ({ text, required = true, ...props }) => {
  return (
    <label
      {...props}
      className="my-1 flex gap-x-1 text-xs font-medium text-gray-500"
    >
      {text}
      {required ? <span className="text-red-600">*</span> : null}
    </label>
  );
};

const Error: React.FC<{ trigger: FieldError | undefined; message: string }> = ({
  message,
  trigger,
}) => {
  if (!trigger) return null;
  return (
    <span role="alert" className="text-xs text-red-600">
      {message} *
    </span>
  );
};

export { CompleteSprintForm, Label, Error };
