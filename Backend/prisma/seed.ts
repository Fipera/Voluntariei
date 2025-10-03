// prisma/seed.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const skills = [
  // 📘 Educação
  "educacao-reforco-escolar",
  "educacao-alfabetizacao-adultos",
  "educacao-informatica-basica",
  "educacao-idiomas",
  "educacao-orientacao-profissional",

  // ❤ Saúde
  "saude-primeiros-socorros",
  "saude-cuidados-idosos",
  "saude-pessoas-deficiencia",
  "saude-educacao-nutricional",
  "saude-campanha-sangue",

  // 🎭 Cultura e Arte
  "arte-musica",
  "arte-teatro-danca",
  "arte-foto-video",
  "arte-artes-plasticas",
  "arte-producao-eventos",

  // 🛠 Construção
  "construcao-pintura",
  "construcao-marcenaria",
  "construcao-eletrica",
  "construcao-alvenaria",
  "construcao-jardinagem",

  // 🤝 Apoio Social
  "social-distribuicao-alimentos",
  "social-logistica-eventos",
  "social-recepcao-acolhimento",
  "social-fundraising",
  "social-midias-sociais",
];

async function main() {
  for (const name of skills) {
    await prisma.skill.upsert({
      where: { name },        // se já existir, não duplica
      update: {},             // (nada a atualizar)
      create: { name },       // senão, cria
    });
  }
  console.log("✅ Skills seed concluído!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
