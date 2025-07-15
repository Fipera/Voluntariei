import { Box } from "../../../ui/box";
import { Checkbox, CheckboxIcon, CheckboxIndicator, CheckboxLabel } from "../../../ui/checkbox";
import { CheckIcon } from "../../../ui/icon";
import { Text } from "../../../ui/text";

export const SkillCheckbox = ({
  value,
  label,
  selectedSkills,
  toggleSkill,
}: {
  value: string;
  label: string;
  selectedSkills: string[];
  toggleSkill: (value: string) => void;
}) => {
  return (
    <Box className="border border-blue-dark shadow-shadow rounded-lg p-4 flex-row items-center">
      <Checkbox
        value={value}
        isChecked={selectedSkills.includes(value)}
        onChange={() => toggleSkill(value)}
      >
        <CheckboxIndicator className="border border-[#3481F0] data-[state=checked]:bg-[#3481F0]">
          <CheckboxIcon
            as={CheckIcon}
            className="text-white data-[state=unchecked]:hidden"
          />
        </CheckboxIndicator>
        <CheckboxLabel>
          <Text
            size="xl"
            className="font-PoppinsBold text-blue-dark"
          >
            {label}
          </Text>
        </CheckboxLabel>
      </Checkbox>
    </Box>
  );
};
