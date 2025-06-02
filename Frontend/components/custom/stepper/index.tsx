import { Box } from "@/components/ui/box";
import { ButtonText } from "@/components/ui/button";
import { HStack } from "@/components/ui/hstack";


const Stepper = ({ etapaAtual = 1 }) => {
  return (
    <HStack className="flex-row items-center justify-center mt-6 space-x-2">
      {/* Etapa 1 */}
      <Box
        className={`w-4 h-4 rounded-full ${
          etapaAtual >= 1 ? "bg-blue-dark" : "bg-gray-300"
        }`}
      />
      {/* Linha entre 1 e 2 */}
      <Box
        className={`h-0.5 w-6 ${
          etapaAtual >= 2 ? "bg-blue-dark" : "bg-gray-300"
        }`}
      />
      {/* Etapa 2 */}
      <Box
        className={`w-4 h-4 rounded-full ${
          etapaAtual >= 2 ? "bg-blue-dark" : "bg-gray-300"
        }`}
      />
      {/* Linha entre 2 e 3 */}
      <Box
        className={`h-0.5 w-6 ${
          etapaAtual >= 3 ? "bg-blue-dark" : "bg-gray-300"
        }`}
      />
      {/* Etapa 3 */}
      <Box
        className={`w-4 h-4 rounded-full ${
          etapaAtual >= 3 ? "bg-blue-dark" : "bg-gray-300"
        }`}
      />
    </HStack>
  );
};

export default Stepper;