export interface Candidat {
  id: number;
  nom: string;
  prenom: string;
  affiliationOuParti: string;
  biographie: string;
  photoUrl?: string;
  programmePdfUrl?: string;
  electionId: number;
}

export interface CandidatRequest {
  nom: string;
  prenom: string;
  affiliationOuParti: string;
  biographie: string;
}

export interface UpdatePhotoRequest {
  photoUrl: string;
}

export interface UpdateProgrammeRequest {
  programmePdfUrl: string;
}
