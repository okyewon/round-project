import styled from "styled-components";
import { auth } from "../../firebase";
import { IoSearch } from "react-icons/io5";
import { useNavigate } from "react-router";
import { FormEvent, useEffect, useState, useCallback } from "react";
import { shelterAtom } from "../store/shelterStore";
import { ShelterType, fetchShelters } from "../../api";
import { useSetRecoilState } from "recoil";
import Loading from "../common/Loading";
import { useQuery } from "@tanstack/react-query";

const Home = () => {
  const name = auth.currentUser?.displayName;
  const navigate = useNavigate();
  const setShelters = useSetRecoilState<ShelterType[]>(shelterAtom);
  const { data, status } = useQuery({
    queryKey: ["fetchShelters"],
    queryFn: fetchShelters,
  });
  const [value, setValue] = useState("");
  const [options, setOptions] = useState<string[]>([]);

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

      const orgData = newShelters.map((shelter) => {
        return shelter.orgNm;
      });
      orgData.sort((a, b) => a.localeCompare(b));
      const setOrgData = new Set(orgData);
      setOptions([...setOrgData]);
    }
  }, [data, status, setShelters]);

  useEffect(() => {
    init();
  }, [init]);

  if (options.length === 0) {
    return <Loading />;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/map", { state: { region: value } });
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  return (
    <Wrapper>
      <Title>
        안녕하세요👋, {name} 님! <br />
        댕냥이들 보러 가볼까요~?🐶🐱
      </Title>
      <Form className="search" onSubmit={handleSubmit}>
        <Select onChange={onChange}>
          <option value="">지역을 선택해주세요.</option>
          {options.map((option, idx) => (
            <option key={`${idx}`} value={option}>
              {option}
            </option>
          ))}
        </Select>
        <Button type="submit">
          <IoSearch />
        </Button>
      </Form>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  text-align: center;

  .search {
    width: 400px;
    height: 60px;
    border-radius: 16px;
  }
`;

const Title = styled.h2`
  margin-bottom: 50px;
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.6;
`;

const Form = styled.form`
  position: relative;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  border: 2px solid #003e46;
`;

const Select = styled.select`
  flex-grow: 1;
  padding: 15px 20px;
  border-radius: inherit;
  &:focus,
  &:active {
    outline: none;
  }
  option {
    background-color: #efefef;
    font-size: 1.1rem;
  }
`;

const Button = styled.button`
  padding: 0 20px;
  font-size: 1.5rem;
`;

export default Home;
