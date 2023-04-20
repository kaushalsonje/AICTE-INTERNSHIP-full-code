"use client";
import React, { Fragment, useState, useRef, useCallback } from "react";
import { Draggable } from "react-beautiful-dnd";
import { IssueIcon } from "../issue-icon";
import { Button } from "../ui/button";
import clsx from "clsx";
import { BsThreeDots } from "react-icons/bs";
import { Avatar } from "../avatar";
import { ChildrenTreeIcon } from "../icons";
import { NotImplemented } from "../not-implemented";
import { DropdownTrigger } from "../ui/dropdown-menu";
import { ContextTrigger } from "../ui/context-menu";
import { IssueContextMenu, IssueDropdownMenu } from "../issue-menu";
import { IssueStatusSelect } from "../issue-select-status";
import { MdEdit } from "react-icons/md";
import { IssueTitle } from "../issue-title";
import { usePathname } from "next/navigation";
import { useSelectedIssueContext } from "@/hooks/useSelectedIssue";

export type IssueType = {
  id: string;
  status: "TODO" | "IN_PROGRESS" | "DONE";
  type: "TASK" | "STORY" | "BUG" | "EPIC";
  assignee?: string;
  title: string;
  description: string | null;
  sprint: string;
  epic: string | null;
  comments: string[];
  logs: string[];
};

const Issue: React.FC<{
  id: IssueType["id"];
  type: IssueType["type"];
  status: IssueType["status"];
  index: number;
}> = ({ id, index, type, status }) => {
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  const { setIssue } = useSelectedIssueContext();

  const setSelectedIssue = useCallback(() => {
    setIssue(id);

    const urlWithQuery = pathname + (id ? `?selectedIssue=${id}` : "");

    window.history.pushState(null, "", urlWithQuery);
  }, [id, pathname, setIssue]);

  return (
    <Fragment>
      <Draggable draggableId={id} index={index}>
        {({ innerRef, dragHandleProps, draggableProps }, { isDragging }) => (
          <div
            role="button"
            onClick={setSelectedIssue}
            ref={innerRef}
            {...draggableProps}
            {...dragHandleProps}
            className={clsx(
              isDragging ? "bg-blue-100" : "bg-white",
              "group flex w-full min-w-max items-center justify-between border-[0.3px] border-gray-300  px-3  py-1.5 text-sm hover:bg-gray-50"
            )}
          >
            <div
              data-state={isEditing ? "editing" : "not-editing"}
              className="flex w-fit items-center gap-x-2 [&[data-state=editing]]:w-full"
            >
              <IssueIcon issueType={type} />
              <div className="whitespace-nowrap text-gray-600">SP2023-128</div>
              <IssueTitle
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                title="Issue title goes here"
                ref={inputRef}
              />
              <div
                data-state={isEditing ? "editing" : "not-editing"}
                className="flex items-center gap-x-1 [&[data-state=editing]]:hidden"
              >
                <Button
                  onClick={() => {
                    setIsEditing(!isEditing);
                  }}
                  className="invisible w-0 px-0 group-hover:visible group-hover:w-fit group-hover:bg-transparent group-hover:px-1.5 group-hover:hover:bg-gray-200 "
                >
                  <MdEdit className="text-sm" />
                </Button>
                <div className="whitespace-nowrap rounded-[3px] bg-indigo-500 bg-opacity-30 px-2 text-xs font-bold text-indigo-700">
                  EPIC-LABEL
                </div>
              </div>
            </div>
            <IssueContextMenu isEditing={isEditing}>
              <ContextTrigger className="h-8 w-full" />
            </IssueContextMenu>
            <div className="relative flex items-center justify-between">
              <NotImplemented feature="child issues">
                <button>
                  <ChildrenTreeIcon className="mx-2 text-gray-600" />
                </button>
              </NotImplemented>
              <IssueStatusSelect currentStatus={status} />
              <Avatar
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                alt=""
                className="mx-1"
              />
              <IssueDropdownMenu>
                <DropdownTrigger
                  asChild
                  className="rounded-m flex w-16 items-center gap-x-1 bg-opacity-30 px-1.5 py-0.5 text-xs font-semibold text-white focus:ring-2 "
                >
                  <div className="invisible rounded-sm px-2 py-1.5 text-zinc-700 group-hover:visible group-hover:bg-zinc-200 group-hover:hover:bg-zinc-300 [&[data-state=open]]:visible [&[data-state=open]]:bg-slate-700 [&[data-state=open]]:text-white">
                    <BsThreeDots className="sm:text-xl" />
                  </div>
                </DropdownTrigger>
              </IssueDropdownMenu>
            </div>
          </div>
        )}
      </Draggable>
    </Fragment>
  );
};

export { Issue };
