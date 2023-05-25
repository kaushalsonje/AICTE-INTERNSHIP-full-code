import { type Control, Controller, type FieldErrors } from "react-hook-form";
import { Error, type FormValues, Label, DEFAULT_DURATION } from "..";
import clsx from "clsx";
import { Fragment } from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectIcon,
  SelectItem,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from "@/components/ui/select";
import { FaChevronDown } from "react-icons/fa";

const DurationField: React.FC<{
  control: Control<FormValues, "duration">;
  errors: FieldErrors<FormValues>;
}> = ({ control, errors }) => {
  const durationOptions = ["1 week", "2 weeks", "3 weeks", "4 weeks", "custom"];

  return (
    <Fragment>
      <Label htmlFor="duration" text="Duration" />
      <Controller
        control={control}
        name="duration"
        defaultValue={DEFAULT_DURATION}
        render={({ field }) => {
          return (
            <Select
              onValueChange={field.onChange}
              defaultValue={DEFAULT_DURATION}
            >
              <SelectTrigger className="flex h-10 w-64 items-center justify-between rounded-[3px] bg-gray-100 px-2 text-xs font-semibold transition-all duration-200 hover:bg-gray-200 focus:ring-2">
                <SelectValue />
                <SelectIcon>
                  <FaChevronDown className="text-gray-500" />
                </SelectIcon>
              </SelectTrigger>
              <SelectPortal className="z-[999]">
                <SelectContent position="popper">
                  <SelectViewport className="w-64 rounded-md border border-gray-300 bg-white py-2 shadow-md">
                    <SelectGroup>
                      {durationOptions.map((option) => (
                        <SelectItem
                          key={option}
                          value={option}
                          className={clsx(
                            "border-l-2 border-transparent py-2 pl-3 text-sm hover:cursor-default hover:border-inprogress hover:bg-gray-100 [&[data-state=checked]]:border-inprogress [&[data-state=checked]]:bg-blue-100 [&[data-state=checked]]:text-blue-600"
                          )}
                        >
                          <span className={clsx("px-2 text-xs")}>{option}</span>
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectViewport>
                </SelectContent>
              </SelectPortal>
            </Select>
          );
        }}
      />
      <Error trigger={errors.duration} message="Duration is required" />
    </Fragment>
  );
};

export { DurationField };
