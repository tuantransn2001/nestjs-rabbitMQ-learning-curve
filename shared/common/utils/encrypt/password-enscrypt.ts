export class PasswordEncrypt {
  public static async hashPassword(password: string): Promise<string> {
    // const salt = await bcrypt.genSalt(10);
    // return await bcrypt.hash(password, salt);

    return password;
  }

  public static async comparePassword(
    password: string,
    hashPassword: string,
  ): Promise<boolean> {
    // const isMatch = await bcrypt.compare(password, hashPassword);
    const isMatch = password === hashPassword;
    return !!isMatch;
  }
}
