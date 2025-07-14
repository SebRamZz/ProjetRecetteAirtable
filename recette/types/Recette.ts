export interface Recette {
  id: string;
  fields: {
    name: string;
    description?: string;
    ingredients?: string;
    nb_personnes?: number;
    intoleranceAlimentaire?: string;
    calories?: string;
    proteines?: string;
    glucides?: string;
    lipides?: string;
    vitamines?: string;
    mineraux?: string;
    image?: string;
    images?: { url: string; alt?: string }[];
  };
}
