import { IoSearch } from "react-icons/io5";
import {
  SelectButton,
  SelectForm,
  List,
  Pagination,
  SearchWrap,
  Select,
  Wrapper,
} from "./KakaoMapStyle";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { useLocation } from "react-router";
import { useRecoilValue } from "recoil";
import { shelterAtom } from "../store/shelterStore";
import { ShelterType } from "../../api";

declare global {
  interface Window {
    kakao: any;
  }
}

interface LocationState {
  region?: string;
}

const KakaoMap = () => {
  const location = useLocation();
  const state = (location.state as LocationState) ?? {}; // 기본값 설정
  const { region = "" } = state;
  const [displayMap, setDisplayMap] = useState<kakao.maps.Map | null>(null);
  const [infowindow, setInfowindow] = useState<kakao.maps.InfoWindow | null>(
    null,
  );
  const [value, setValue] = useState("");
  const shelters = useRecoilValue(shelterAtom);
  const [options, setOptions] = useState<string[]>([]);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);

  const init = useCallback(() => {
    if (displayMap) return;
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };

    if (container) {
      const mapInstance = new kakao.maps.Map(container, options);

      const defaultPosition = new kakao.maps.LatLng(33.450701, 126.570667);
      mapInstance.setCenter(defaultPosition);

      setDisplayMap(mapInstance);
    }

    const infowindowInstance = new kakao.maps.InfoWindow({ zIndex: 1 });
    setInfowindow(infowindowInstance);
  }, [displayMap]);

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    const orgData = shelters.map((shelter) => {
      return shelter.orgNm;
    });
    orgData.sort((a, b) => a.localeCompare(b));
    const setOrgData = new Set(orgData);
    setOptions([...setOrgData]);
  }, [shelters]);

  useEffect(() => {
    if (displayMap && region) {
      const filteredShelters = shelters.filter(
        (shelter) => shelter.orgNm === region,
      );

      const bounds = new kakao.maps.LatLngBounds();

      displayPlaces(filteredShelters, bounds);

      if (filteredShelters.length > 0) {
        displayMap.setBounds(bounds);
      }
    }
  }, [displayMap, region, shelters, infowindow]);

  const searchPlaces = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filteredShelters = shelters.filter(
      (shelter) => shelter.orgNm === value,
    );

    if (filteredShelters.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      displayPlaces(filteredShelters, bounds);
      displayMap?.setBounds(bounds);
    }
  };

  const displayPlaces = (
    places: ShelterType[],
    bounds: kakao.maps.LatLngBounds,
  ) => {
    const listEl = document.getElementById("placesList");
    const newMarkers: kakao.maps.Marker[] = [];

    removeAllChildNodes(listEl);
    removeMarker();

    let remainingPlaces = places.length;

    places.forEach((place: ShelterType, i: number) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(place.careAddr, function (result, status) {
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(+result[0].y, +result[0].x);

          const addedMarker = addMarker(coords, i);
          const itemEl = getListItem(i, place);
          (function (addedMarker, place) {
            kakao.maps.event.addListener(addedMarker, "click", function () {
              displayInfowindow(addedMarker, place);
            });
            itemEl.onclick = function () {
              displayInfowindow(addedMarker, place);
            };
          })(addedMarker, place);

          newMarkers.push(addedMarker);
          listEl?.appendChild(itemEl);

          bounds.extend(coords);
        }

        remainingPlaces -= 1;

        // 모든 마커들이 추가되고 지도 경계를 업데이트
        if (remainingPlaces === 0) {
          setMarkers(newMarkers);
          displayMap?.setBounds(bounds);
        }
      });
    });
  };

  const addMarker = (position: kakao.maps.LatLng, idx: number) => {
    const imageSrc =
      "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png";
    const imageSize = new kakao.maps.Size(36, 37);
    const imgOptions = {
      spriteSize: new kakao.maps.Size(36, 691),
      spriteOrigin: new kakao.maps.Point(0, idx * 46 + 10),
      offset: new kakao.maps.Point(13, 37),
    };
    const markerImage = new kakao.maps.MarkerImage(
      imageSrc,
      imageSize,
      imgOptions,
    );
    const marker = new kakao.maps.Marker({
      position,
      image: markerImage,
    });

    marker.setMap(displayMap);
    return marker;
  };

  const removeMarker = () => {
    markers.forEach((marker) => marker.setMap(null));
    setMarkers([]);
  };

  const getListItem = (index: number, place: ShelterType) => {
    const el = document.createElement("li");
    const itemStr = `
      <span class="markerbg marker_${index + 1}"></span>
      <div class="info">
        <h5 class="text-lg font-bold">${place.careNm}</h5>
        <span>${place.careAddr}</span>
        <span class="tel">${place.careTel}</span>
      </div>
    `;

    el.innerHTML = itemStr;
    el.className = "item";
    return el;
  };

  const displayInfowindow = (marker: kakao.maps.Marker, place: ShelterType) => {
    if (displayMap && infowindow) {
      infowindow.setContent(
        `<div style="display:grid;grid-template-rows: max-content;gap:5px;padding:5px">
        <p>${place.careNm}</p>
        <p>${place.careTel}</p>
        </div>`,
      );
      infowindow.open(displayMap, marker);

      // 이벤트 전파 방지
      kakao.maps.event.addListener(
        marker,
        "click",
        function (event: { stopPropagation: () => void }) {
          event.stopPropagation();
        },
      );
    }
  };

  const removeAllChildNodes = (el: HTMLElement | null) => {
    if (el === null) return;

    while (el.hasChildNodes()) {
      el.removeChild(el.lastChild as ChildNode);
    }
  };

  const onChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setValue(e.target.value);
  };

  return (
    <Wrapper>
      <div id="map" className="w-full h-full"></div>
      <SearchWrap id="menu_wrap" className="bg_white">
        <div className="option">
          <div>
            <SelectForm onSubmit={searchPlaces}>
              <Select onChange={onChange} value={value}>
                <option value="">지역을 선택해주세요.</option>
                {options.map((option, idx) => (
                  <option key={`${idx}`} value={option}>
                    {option}
                  </option>
                ))}
              </Select>
              <SelectButton type="submit">
                <IoSearch />
              </SelectButton>
            </SelectForm>
          </div>
        </div>
        <List id="placesList"></List>
        <Pagination id="pagination"></Pagination>
      </SearchWrap>
    </Wrapper>
  );
};

export default KakaoMap;
