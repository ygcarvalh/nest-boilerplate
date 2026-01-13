export type JwtPayload = {
  sub: number;
  email: string;
};

export type StringValue = `${number}${'ms' | 's' | 'm' | 'h' | 'd' | 'w' | 'y'}`;
