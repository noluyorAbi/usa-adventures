import { Composition } from "remotion";
import { Promo } from "./Promo";
import { OgImage } from "./OgImage";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Promo"
        component={Promo}
        durationInFrames={360}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="OG"
        component={OgImage}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={630}
      />
    </>
  );
};
