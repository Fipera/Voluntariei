import { SKILL_IMAGE_MAP, DEFAULT_SKILL_IMAGE } from './voluntarySkillImages';

export interface SkillGroup {
  key: string;
  icon: string;
  title: string;
  skills: { value: string; label: string; image?: any }[];
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    key: "educacao",
    icon: "📘",
    title: "Educação",
    skills: [
      { value: "educacao-reforco-escolar", label: "Reforço Escolar", image: SKILL_IMAGE_MAP['educacao-reforco-escolar'] || DEFAULT_SKILL_IMAGE },
      { value: "educacao-alfabetizacao-adultos", label: "Alfabetização", image: SKILL_IMAGE_MAP['educacao-alfabetizacao-adultos'] || DEFAULT_SKILL_IMAGE },
      { value: "educacao-informatica-basica", label: "Informática Básica", image: SKILL_IMAGE_MAP['educacao-informatica-basica'] || DEFAULT_SKILL_IMAGE },
      { value: "educacao-idiomas", label: "Idiomas", image: SKILL_IMAGE_MAP['educacao-idiomas'] || DEFAULT_SKILL_IMAGE },
      { value: "educacao-orientacao-profissional", label: "Orientação Prof.", image: SKILL_IMAGE_MAP['educacao-orientacao-profissional'] || DEFAULT_SKILL_IMAGE },
    ],
  },
  {
    key: "saude",
    icon: "❤",
    title: "Saúde",
    skills: [
      { value: "saude-primeiros-socorros", label: "Primeiros Socorros", image: SKILL_IMAGE_MAP['saude-primeiros-socorros'] || DEFAULT_SKILL_IMAGE },
      { value: "saude-cuidados-idosos", label: "Cuidados Pessoais", image: SKILL_IMAGE_MAP['saude-cuidados-idosos'] || DEFAULT_SKILL_IMAGE },
      { value: "saude-pessoas-deficiencia", label: "Apoio Especial", image: SKILL_IMAGE_MAP['saude-pessoas-deficiencia'] || DEFAULT_SKILL_IMAGE },
      { value: "saude-educacao-nutricional", label: "Nutrição", image: SKILL_IMAGE_MAP['saude-educacao-nutricional'] || DEFAULT_SKILL_IMAGE },
      { value: "saude-campanha-sangue", label: "Doação Sangue", image: SKILL_IMAGE_MAP['saude-campanha-sangue'] || DEFAULT_SKILL_IMAGE },
    ],
  },
  {
    key: "cultura",
    icon: "🎭",
    title: "Cultura e Arte",
    skills: [
      { value: "arte-musica", label: "Música", image: SKILL_IMAGE_MAP['arte-musica'] || DEFAULT_SKILL_IMAGE },
      { value: "arte-teatro-danca", label: "Teatro Dança", image: SKILL_IMAGE_MAP['arte-teatro-danca'] || DEFAULT_SKILL_IMAGE },
      { value: "arte-foto-video", label: "Foto Vídeo", image: SKILL_IMAGE_MAP['arte-foto-video'] || DEFAULT_SKILL_IMAGE },
      { value: "arte-artes-plasticas", label: "Artes", image: SKILL_IMAGE_MAP['arte-artes-plasticas'] || DEFAULT_SKILL_IMAGE },
      { value: "arte-producao-eventos", label: "Eventos", image: SKILL_IMAGE_MAP['arte-producao-eventos'] || DEFAULT_SKILL_IMAGE },
    ],
  },
  {
    key: "construcao",
    icon: "🛠",
    title: "Construção",
    skills: [
      { value: "construcao-pintura", label: "Pintura", image: SKILL_IMAGE_MAP['construcao-pintura'] || DEFAULT_SKILL_IMAGE },
      { value: "construcao-marcenaria", label: "Marcenaria", image: SKILL_IMAGE_MAP['construcao-marcenaria'] || DEFAULT_SKILL_IMAGE },
      { value: "construcao-eletrica", label: "Elétrica", image: SKILL_IMAGE_MAP['construcao-eletrica'] || DEFAULT_SKILL_IMAGE },
      { value: "construcao-alvenaria", label: "Alvenaria", image: SKILL_IMAGE_MAP['construcao-alvenaria'] || DEFAULT_SKILL_IMAGE },
      { value: "construcao-jardinagem", label: "Jardinagem", image: SKILL_IMAGE_MAP['construcao-jardinagem'] || DEFAULT_SKILL_IMAGE },
    ],
  },
  {
    key: "social",
    icon: "🤝",
    title: "Apoio Social",
    skills: [
      { value: "social-distribuicao-alimentos", label: "Distribuição", image: SKILL_IMAGE_MAP['social-distribuicao-alimentos'] || DEFAULT_SKILL_IMAGE },
      { value: "social-logistica-eventos", label: "Logística", image: SKILL_IMAGE_MAP['social-logistica-eventos'] || DEFAULT_SKILL_IMAGE },
      { value: "social-recepcao-acolhimento", label: "Acolhimento", image: SKILL_IMAGE_MAP['social-recepcao-acolhimento'] || DEFAULT_SKILL_IMAGE },
      { value: "social-fundraising", label: "Captação", image: SKILL_IMAGE_MAP['social-fundraising'] || DEFAULT_SKILL_IMAGE },
      { value: "social-midias-sociais", label: "Mídias", image: SKILL_IMAGE_MAP['social-midias-sociais'] || DEFAULT_SKILL_IMAGE },
    ],
  },
];
