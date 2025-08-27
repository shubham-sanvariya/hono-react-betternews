import { FieldApi } from "@tanstack/react-form";
import { ZodIssue } from "zod";

export function FieldInfo({ field } : { // @ts-ignore
  field: FieldApi<any, any, any>}){

  return <>
    {field.state.meta.isTouched && field.state.meta.errors.length ? (
      <p className={'text-[0.8rem] font-medium text-destructive'}>{field.state.meta.errors.map((e : ZodIssue) => e.message).join(", ")}</p>
    ) : null}
  </>
}
