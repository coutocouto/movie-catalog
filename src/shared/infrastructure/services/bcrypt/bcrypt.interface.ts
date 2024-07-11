export interface IBcryptService {
  encodePassword(hashString: string): Promise<string>;
  comparePassword(password: string, hashPassword: string): Promise<boolean>;
}
