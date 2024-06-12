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
  nearby?: boolean;
}

const KakaoMap2 = () => {
  const location = useLocation();
  const state = (location.state as LocationState) ?? {}; // 기본값 설정
  const { region = "", nearby = false } = state;
  const [map, setMap] = useState<kakao.maps.Map | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [infowindow, setInfowindow] = useState<kakao.maps.InfoWindow | null>(
    null,
  );
  const [value, setValue] = useState("");
  const shelters = useRecoilValue(shelterAtom);
  const [options, setOptions] = useState<string[]>([]);
  const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);

  const init = useCallback(() => {
    if (map) return;
    const container = document.getElementById("map");
    const options = {
      center: new kakao.maps.LatLng(33.450701, 126.570667),
      level: 3,
    };
    let mapInstance: kakao.maps.Map;
    if (container) {
      mapInstance = new kakao.maps.Map(container, options);

      if (nearby && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setCurrentLocation({ lat, lng });

          const locPosition = new kakao.maps.LatLng(lat, lng);
          mapInstance.setCenter(locPosition);
        });
      } else {
        const defaultPosition = new kakao.maps.LatLng(33.450701, 126.570667);
        mapInstance.setCenter(defaultPosition);
      }

      setMap(mapInstance);
    }

    const infowindowInstance = new kakao.maps.InfoWindow({ zIndex: 1 });
    setInfowindow(infowindowInstance);
  }, [map, nearby]);

  useEffect(() => {
    const orgData = shelters.map((shelter) => {
      return shelter.orgNm;
    });
    orgData.sort((a, b) => a.localeCompare(b));
    const setOrgData = new Set(orgData);
    setOptions([...setOrgData]);
  }, [shelters]);

  useEffect(() => {
    init();
  }, [init, map]);

  useEffect(() => {
    if (map && region) {
      const filteredShelters = shelters.filter(
        (shelter) => shelter.orgNm === region,
      );

      const bounds = new kakao.maps.LatLngBounds();

      displayPlaces(filteredShelters, bounds);

      if (filteredShelters.length > 0) {
        map.setBounds(bounds);
      }
    }
  }, [map, region, shelters, infowindow]);

  const searchPlaces = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const filteredShelters = shelters.filter(
      (shelter) => shelter.orgNm === value,
    );

    if (filteredShelters.length > 0) {
      const bounds = new kakao.maps.LatLngBounds();
      displayPlaces(filteredShelters, bounds);
      map?.setBounds(bounds);
    }
  };

  const displayPlaces = (
    places: ShelterType[],
    bounds: kakao.maps.LatLngBounds,
  ) => {
    const listEl = document.getElementById("placesList");
    const newMarkers: kakao.maps.Marker[] = [];

    removeAllChildNods(listEl);
    removeMarker();

    places.forEach((place: ShelterType, i: number) => {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(place.careAddr, function (result, status) {
        // 정상적으로 검색이 완료됐으면
        if (status === kakao.maps.services.Status.OK) {
          const coords = new kakao.maps.LatLng(+result[0].y, +result[0].x);

          // 결과값으로 받은 위치를 마커로 표시합니다
          const marker = new kakao.maps.Marker({
            position: coords,
          });
          marker.setMap(map);
          bounds.extend(coords);

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
        }
      });
    });

    setMarkers(newMarkers);
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

    marker.setMap(map);
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
    if (infowindow) {
      infowindow.setContent(
        `<div style="display:flex;flex-direction:column;gap:5px;padding:5px;z-index:1;">
        <p>${place.careNm}</p>
        <p>${place.careTel}</p>
        </div>`,
      );
      infowindow.open(map, marker);

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

  const displayPagination = (pagination: any) => {
    const paginationEl = document.getElementById("pagination");
    removeAllChildNods(paginationEl);

    for (let i = 1; i <= pagination.last; i++) {
      const el = document.createElement("a");
      el.href = "#";
      el.innerHTML = `${i}`;

      if (i === pagination.current) {
        el.className = "on";
      } else {
        el.onclick = (function (i) {
          return function () {
            pagination.gotoPage(i);
          };
        })(i);
      }

      paginationEl?.appendChild(el);
    }
  };

  const removeAllChildNods = (el: HTMLElement | null) => {
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

export default KakaoMap2;
