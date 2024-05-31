import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const shelterURL =
  "http://apis.data.go.kr/1543061/animalShelterSrvc/shelterInfo";
const SHELTER_KEY =
  "+9vWqLs8ANkKBJxHRbv96jZRHdI40Tovc3gudRgK7TNH1+fTDk6Fx19KiysgqhrSlAz+ZWXZYJbnmWozsBO8Eg==";

// Query parameters
const params = {
  serviceKey: SHELTER_KEY,
  care_reg_no: "",
  care_nm: "",
  numOfRows: "500",
  pageNo: "1",
  _type: "",
};

export interface ShelterType {
  careNm: string;
  divisionNm: string;
  saveTrgtAnimal?: string;
  careAddr: string;
  lat?: string;
  lng?: string;
  closeDay?: string;
  careTel: string;
}

const fetchShelters = async () => {
  try {
    const response = await axios.get(shelterURL, { params });
    return response.data;
  } catch (error) {
    throw new Error("Error fetching shelters");
  }
};

export const Shelters = () => {
  const { status, data } = useQuery({
    queryKey: ["fetchShelters"],
    queryFn: fetchShelters,
  });

  return { status, data };
};
