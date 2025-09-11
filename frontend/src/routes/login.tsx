import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router";
import { useForm } from "@tanstack/react-form";
import { useQueryClient } from "@tanstack/react-query";
import { fallback, zodSearchValidator } from "@tanstack/router-zod-adapter";



import { toast } from "sonner";
import { z } from "zod";



import { loginSchema } from "@/shared/types";
import { postLogin, userQueryOptions } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FieldInfo } from "@/components/field-info";





const loginSearchSchema = z.object({
  redirect: fallback(z.string(), "/").default("/"),
});

export const Route = createFileRoute('/login')({
  component: Login,
  validateSearch: zodSearchValidator(loginSearchSchema),
  beforeLoad: async ({ context, search }) => {
    const user = await context.queryClient.ensureQueryData(userQueryOptions());

    if (user){
      throw redirect({ to: search.redirect })
    }
  }
})

function Login() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const router = useRouter();
  const queryClient = useQueryClient();

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
    validators: {
      onChange: loginSchema,
    },
    onSubmit: async ({ value }) => {
      const res = await postLogin(value.username, value.password);

      if (res.success){
        await queryClient.invalidateQueries({
          queryKey: ["user"]
        });
        await router.invalidate();
        await navigate({ to: search.redirect });
        return null;
      }else {
        if (!res.isFormError){
          toast.error("Signup failed", { description: res.error });
        }

        form.setErrorMap({
          onSubmit: res.isFormError ? res.error : "Unexpected error"
        })
      }
    }
  });

  return (
    <div className={"w-full"}>
      <Card className="mx-auto mt-12 max-w-sm border-border/25">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit().finally(() => console.log("login form submit")
            );
          }}
        >
          <CardHeader>
            <CardTitle className="text-center text-2xl">Login</CardTitle>
            <CardDescription>
              Enter your details below to login
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className={"grid gap-4"}>
              <form.Field
                name={"username"}
                children={(field) => (
                  <div className={"grid gap-2"}>
                    <Label htmlFor={field.name}>Username</Label>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field}/>
                  </div>
                )}
              />
              <form.Field
                name={"password"}
                children={(field) => (
                  <div className={"grid gap-2"}>
                    <Label htmlFor={field.name}>Password</Label>
                    <Input
                      id={field.name}
                      type={"password"}
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    <FieldInfo field={field}/>
                  </div>
                )}
              />
              <form.Subscribe
                selector={(state) => [state.errorMap]}
                children={([errorMap]) => {
                  return errorMap.onSubmit ? (
                    <p className="text-[0.8rem] font-medium text-destructive">
                      {String(errorMap.onSubmit)}
                    </p>
                  ) : null
                }}
              />
              <form.Subscribe
                selector={(state) => [state.canSubmit, state.isSubmitting]}
                children={([canSubmit, isSubmitting]) => (
                  <Button type={"submit"} disabled={!canSubmit}
                          className="w-full"
                  >
                    {isSubmitting ? "..." : "Login"}
                  </Button>
                )}
              />
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  );
}
