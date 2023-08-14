import User, { IUSer } from "../models/user";
import { sendEmail } from "../mailer/mailer";
export const existsEmail = async (email: string): Promise<void> => {
    const existEmail: IUSer | null = await User.findOne({email});

    if(existEmail && existEmail.verified){
        throw new Error(`El email ${email}, ya existe en la DB`)
    }
    if(existEmail && !existEmail.verified){
        await sendEmail(email, existEmail.code as string)
        throw new Error(`El usuario ya está registrado. Se envio nuevamente código de verificación a ${email}`)
    }
};
