import { Heading } from "@chakra-ui/react";
import { Item } from "./pagex";

const keyframes = {
  heading: {
    enter: {
      // how heading will appear 0% of the way through page entrance
      0: {
        translateY: 100,
        rotateZ: 8,
        scale: 0.66,
      },
      // how heading will appear 60% of the way through page entrance
      0.6: {
        translateY: 0,
        rotateZ: 0,
        scale: 1,
      },
    },
    exit: {
      // how heading will appear 0% of the way through page exit
      0: {
        translateY: 0,
        rotateZ: 0,
        scale: 1,
      },
      // how heading will appear 50% of the way through page exit
      0.5: {
        translateY: -50,
        rotateZ: -8,
        scale: 0.66,
      },
    },
  },
};

const TransitionHeading = ({ children }: any) => {
  return (
    <Heading
      as={Item}
      keyframes={keyframes.heading}
      display="inline-block"
      size="4xl"
    >
      {children}
    </Heading>
  );
};

export default TransitionHeading;
