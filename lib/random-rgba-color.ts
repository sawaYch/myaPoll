import randomColor from 'randomcolor';

export const randomRGBAColor = (n: number) => {
  const colors = [];
  const borderColor = [];

  const randAttrColor = randomColor({
    format: 'rgba',
    alpha: 0.5,
    hue: 'red',
    luminosity: 'light',
    count: n,
  });

  const colorString = randAttrColor.map((it) => it.replace('0.5', '1.0'));
  const borderColorString = randAttrColor;

  return { bar: colorString, border: borderColorString };
};
