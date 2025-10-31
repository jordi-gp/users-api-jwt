import z from "zod";

const invalidString = "El valor ha de ser de tipo texto";
const requiredErrMsg = "Campo obligatorio";

const userSchema = z.object({
    name: z.string({
            invalid_type_error: invalidString,
            required_error: requiredErrMsg,
        })
        .min(3, {
            error: "El nombre ha de contener almenos 3 caracteres"
        })
        .max(25, { 
            error: "El nombre no puede contener mas de 25 caracteres"
        }),
    lastname: z.string({
        invalid_type_error: invalidString,
    }).optional(),
    username: z.string({
            invalid_type_error: invalidString,
            required_error: requiredErrMsg,
        })
        .min(3, {
            error: "El usuario ha de contener almenos 3 caracteres"
        })
        .max(25, {
            error: "El usuario no puede contener mas de 25 caracteres"
        }),
    email: z.email({
            invalid_type_error: "Formato de correo incorrecto",
            required_error: requiredErrMsg,
        })
        .min(12, {
            error: "El correo ha de contener almenos 12 caracteres"
        })
        .max(25, {
            error: "El correo no puede contener mas de 25 caracteres"
        }),
    password: z.string({
            invalid_type_error: invalidString,
            required_error: requiredErrMsg,
        })
        .min(10, {
            error: "La contraseña ha de contener almenos 10 caracteres",
        }),
    created_at: z.date().optional()
});

export function validateUser(object) {
    return userSchema.safeParse(object);
}

export function validatePartialUser(object) {
    return userSchema.partial().safeParse(object);
}
