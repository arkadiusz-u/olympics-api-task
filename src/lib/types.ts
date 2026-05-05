export type MatchStatus = "FT" | (string & {});

export type ScorerEventType = "open_play" | "header" | "penalty" | (string & {});

export type GenderCode = "M" | "W";

export type Scorer = {
  team: string;
  player: string;
  minute: number;
  assist?: string;
  type: ScorerEventType;
};

export type LinePlayer = {
  name: string;
  number: number;
  position: string;
};

export type SideLineup = {
  team: string;
  formation: string;
  coach: string;
  startingXI: LinePlayer[];
  bench: LinePlayer[];
};

export type BaseScore = {
  home: number;
  away: number;
};

export type FullScore = BaseScore & {
  halfTime: BaseScore;
};

export type Competition = {
  name: string;
  season: string;
  round: string;
};

export type Venue = {
  name: string;
  city: string;
};

export type MatchTeams = {
  home: string;
  away: string;
};

export type Lineups = {
  home: SideLineup;
  away: SideLineup;
};

export type ExampleMatch = {
  competition: Competition;
  venue: Venue;
  kickoff: string;
  status: MatchStatus;
  teams: MatchTeams;
  score: FullScore;
  scorers: Scorer[];
  lineups: Lineups;
};

export type OlympicsApiScheduleResponse = {
  groups: [],
  units: OlympicsApiScheduleUnit[];
};

export type OlympicsApiScheduleUnit = {
  competitors: OlympicsApiCompetitor[];
  disciplineCode: string;
  disciplineId: string;
  disciplineName: string;
  endDate: string;
  eventCode: string;
  eventId: string;
  eventName: string;
  eventOrder: number;
  eventUnitName: string;
  eventUnitType: string;
  extraData: {
    detailUrl: string;
  };
  genderCode: GenderCode;
  hideEndDate: boolean;
  hideStartDate: boolean;
  id: string;
  liveFlag: boolean;
  location: string;
  locationDescription: string;
  medalFlag: number;
  olympicDay: string;
  order: number;
  phaseCode: string;
  phaseId: string;
  phaseName: string;
  phaseType: string;
  scheduleItemType: string;
  sessionCode: string;
  startDate: string;
  startText: string;
  status: string;
  statusDescription: string;
  unitNum: string;
  venue: string;
  venueDescription: string;
}

export type OlympicsApiCompetitor = {
  code: string;
  noc: string;
  name: string;
  order: number;
  results: {
    position: string;
    mark: string;
    winnerLoserTie: string;
    medalType: string;
    irm: string;
  };
}

export type OlympicsApiMatchDetailsResponse = {
  positions: {
    code: string;
    description: string;
  }[]
  results: {
    clock: {
      period: string;
      running: boolean;
      time: string;
    }
    date: string;
    eventUnit: {
      description: string;
      longDescription: string;
      phase: {
        order: string
      };
      shortDescription: string;
    }
    eventUnitCode: string;
    extendedInfos: {
      ei_code: string;
      ei_type: string;
      ei_value: string;
      extended_info_code: string;
    }[]
    items: {
      eventUnitEntries: {
        eue_code: string;
        eue_type: string;
        eue_value: string;
      }[];
      itemType: string;
      participant: {
        code: string;
        name: string;
        organistaion: {
          type: string;
          code: string;
          description: string;
          longDescription: string;
        }
        shortName: string;
        teamType: string;
        __typename: string;
      }
      resultData: string
      resultType: string;
      resultWLT: string;
      sortOrder: number;
      startOrder: string;
      startSortOrder: number;
      statsItems: {
        type: string;
        code: string;
        pos: string;
        value: string;
      }[]
      teamAthletes: TeamAthlete[];
      teamCode: string;
      teamCoaches: TeamCoach[];
    }[]
    officials: Official[];
    periods: Period[];
    playByPlay: PlayByPlay[];
    schedule: Schedule;
    status: {
      code: string;
      description: string;
    }
  }
}

export type Schedule = {
  startDate: string;
  endDate: string;
  status: {
    code: string;
    description: string;
  }
  venue: {
    description: string;
    longDescription: string;
  }
  location: {
    description: string;
    longDescription: string;
    shortDescription: string;
  }
}

export type PlayByPlay = {
  actions: Action[];
  subcode: string;
}

export type Action = {
  extendedActions: ExtendedAction[];
  competitors?: {
    pbpc_code: string;
    pbpc_order: number;
    pbpc_type: string;
    athletes?: {
      pbpat_code: string;
      pbpat_order: string;
      pbpat_bib: string;
      pbpat_role: string;
    }[];
  }[];
  pbpa_Action: string;
  pbpa_ActionAdd: string;
  pbpa_Loc: string;
  pbpa_Result: string;
  pbpa_When: string;
  pbpa_id: string;
  pbpa_order: number;
  pbpa_period: string;
}

export type ExtendedAction = {
  pbpea_code: string;
  pbpea_value: string;
}

export type Period = {
  away: {
    periodScore: string;
    score: string;
  }
  extendedPeriods: {
    ep_code: string;
    ep_type: string;
    ep_value: string;
  }[]
  home: {
    periodScore: string;
    score: string;
  }
  p_code: string;
}

export type Official = {
  function: {
    description: string;
    functionCode: string;
  }
  official: {
    TVName: string;
    code: string;
    familyName: string;
    givenName: string;
    mainFunction: {
      category: string;
    }
    name: string;
    nationality: {
      code: string;
      longDescription: string;
    }
    organisation: {
      code: string;
      description: string;
      longDescription: string;
      type: string;
    }
    shortName: string;
    shortTVName: string;
    __typename: string;
  }
  order: number;
}

export type TeamCoach = {
  order: number;
  function: {
    functionCode: string;
    description: string;
  };
  coach: {
    code: string;
    familyName: string;
    givenName: string;
    name: string;
    shortName: string;
    __typename: string;
    mainFunction: {
      category: string;
    };
    nationality: {
      code: string;
      longDescription: string;
    };
    organisation: {
      code: string;
      longDescription: string;
    };
  };
}

export type Athlete = {
  TVName: string;
  birthDate: string;
  code: string;
  familyName: string;
  givenName: string;
  image: {
    imageType: string;
    imageExtension: string;
    imageVersion: string;
  }
  mainFunction: {
    category: string;
  }
  name: string;
  organisation: {
    code: string;
    description: string;
    longDescription: string;
    type: string;
  }
  personGender: {
    code: string;
    description: string;
  }
  registeredEvents: {
    code: string;
    eventEntries: {
      ee_code: string;
      ee_value: string
    }[]
  }[]
  shortName: string;
  shortTVName: string;
  status: {
    code: string;
    description: string;
  }
  __typename: string;
};

export type TeamAthlete = {
  athlete: Athlete;
  bib: string;
  cumStatsItems: {
    code: string;
    type: string;
    value: string;
  }[];
  eventUnitEntries: {
    eue_code: string;
    eue_pos: string;
    eue_type: string;
    eue_value: string;
  }[];
  order: number;
  participantCode: string;
  startSortOrder: number;
}
