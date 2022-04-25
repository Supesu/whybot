import { DatabaseClient } from "../../../../database";
import { Unique } from "../../contract";
import {
  buildBaseUnique,
  buildOpggUnique,
  buildTrackUnique,
} from "./templates";

export const buildCustomUniques = async (
  database: DatabaseClient
): Promise<Unique[]> => {
  const _uniques: Unique[] = [];
  const toBuild = await database.fetchCollection("uniques");

  toBuild.forEach((unique) => {
    if (unique.data.type === "base") {
      _uniques.push(
        buildBaseUnique(
          unique.id,
          unique.data.triggers,
          unique.data.response,
          unique.data.metadata
        )
      );
    }

    if (unique.data.type === "opgg") {
      _uniques.push(
        buildOpggUnique(
          unique.id,
          unique.data.triggers,
          unique.data.summonerId,
          unique.data.region,
          unique.data.metadata
        )
      );
    }

    if (unique.data.type === "track") {
      _uniques.push(
        buildTrackUnique(
          unique.id,
          unique.data.triggers,
          unique.data.summonerId,
          unique.data.region,
          unique.data.metadata
        )
      );
    }
  });

  return _uniques;
};

interface UniqueData {
  data: {
    triggers: string[];
    response?: string;
    summonerId?: string;
    region?: string;
    type: "track" | "opgg" | "base";
  };
  metadata: {
    description: string;
  };
  id: string;
}

export const buildCustomUnique = async (uniqueData: UniqueData) => {
  if (uniqueData.data.type === "base") {
    return buildBaseUnique(
      uniqueData.id,
      uniqueData.data.triggers,
      uniqueData.data.response,
      uniqueData.metadata
    );
  }

  if (uniqueData.data.type === "opgg") {
    return buildOpggUnique(
      uniqueData.id,
      uniqueData.data.triggers,
      uniqueData.data.summonerId,
      uniqueData.data.region,
      uniqueData.metadata
    );
  }

  if (uniqueData.data.type === "track") {
    return buildTrackUnique(
      uniqueData.id,
      uniqueData.data.triggers,
      uniqueData.data.summonerId,
      uniqueData.data.region,
      uniqueData.metadata
    );
  }
};
