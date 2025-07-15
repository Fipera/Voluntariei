import { AccordionContent, AccordionContentText, AccordionHeader, AccordionIcon, AccordionItem, AccordionTitleText, AccordionTrigger } from "@/components/ui/accordion";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { ArrowDown, ArrowRight } from "lucide-react-native";
import { SkillCheckbox } from "../skillcheckbox";
import { Divider } from "@/components/ui/divider";
import { Box } from "@/components/ui/box";

type SkillOption = {
  value: string;
  label: string;
};

type SkillGroupAccordionProps = {
  title: string;
  value: string;
  skills: SkillOption[];
  selectedSkills: string[];
  toggleSkill: (value: string) => void;
};

export const SkillGroupAccordion = ({
  title,
  value,
  skills,
  selectedSkills,
  toggleSkill,
}: SkillGroupAccordionProps) => {
  return (
    <>
      <AccordionItem value={value} className="rounded-lg bg-transparent">
        <AccordionHeader>
          <AccordionTrigger className="focus:web:rounded-lg">
            {({ isExpanded }) => (
              <>
                <AccordionTitleText>
                  <Text
                    size="2xl"
                    className="font-PoppinsBold text-blue-dark mt-10"
                  >
                    {title}
                  </Text>
                </AccordionTitleText>
                {isExpanded ? (
                  <AccordionIcon as={ArrowRight} className="mr-3" />
                ) : (
                  <AccordionIcon as={ArrowDown} className="mr-3" />
                )}
              </>
            )}
          </AccordionTrigger>
        </AccordionHeader>

        <AccordionContent>
          <AccordionContentText>
            <VStack className="justify-start w-full" space="md">
              {skills.map((skill) => (
                <SkillCheckbox
                  key={skill.value}
                  value={skill.value}
                  label={skill.label}
                  selectedSkills={selectedSkills}
                  toggleSkill={toggleSkill}
                />
              ))}
            </VStack>
          </AccordionContentText>
        </AccordionContent>
      </AccordionItem>

      <Box>
        <Divider className="my-2 bg-grey-light" />
      </Box>
    </>
  );
};