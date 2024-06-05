import { Outlet } from "react-router";
import Header from "../common/Header";
import styled from "styled-components";
import { ShelterType, useFetchShelters } from "../../api";
import { useCallback, useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { shelterAtom } from "../store/shelterStore";

const Index = () => {
  const setShelters = useSetRecoilState<ShelterType[]>(shelterAtom);
  const { data, status } = useFetchShelters();

  const init = useCallback(() => {
    if (status === "success" && data) {
      const xmlString = data;

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, "application/xml");

      const items = xmlDoc.getElementsByTagName("item");
      const newShelters: ShelterType[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const shelter = {
          careNm: item.getElementsByTagName("careNm")[0].textContent,
          orgNm: item.getElementsByTagName("orgNm")[0].textContent,
          divisionNm: item.getElementsByTagName("divisionNm")[0].textContent,
          saveTrgtAnimal:
            item.getElementsByTagName("saveTrgtAnimal")[0]?.textContent || null,
          careAddr: item.getElementsByTagName("careAddr")[0].textContent,
          lat: item.getElementsByTagName("lat")[0]?.textContent || null,
          lng: item.getElementsByTagName("lng")[0]?.textContent || null,
          closeDay:
            item.getElementsByTagName("closeDay")[0]?.textContent || null,
          careTel: item.getElementsByTagName("careTel")[0].textContent,
        } as ShelterType;
        newShelters.push(shelter);
      }

      setShelters((prevShelters) => {
        if (JSON.stringify(prevShelters) !== JSON.stringify(newShelters)) {
          return newShelters;
        }
        return prevShelters;
      });
    }
  }, [data, status]);

  useEffect(() => {
    init();
  }, []);

  return (
    <Wrapper className="min-h-screen">
      <Header />
      <Outlet />
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default Index;
