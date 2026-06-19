'use client';

import PledgeSideBar from '@/components/strikes/PledgeSideBar';
import StrikeInput from '@/components/strikes/StrikeInput';
import WeeksSelect from "@/components/strikes/WeeksSelect";
import StrikeHistory from '@/components/strikes/StrikeHistory';

export default function Strikes() {
  return (
    <>
      <PledgeSideBar />
      <StrikeInput />
      <WeeksSelect />
      <StrikeHistory />
    </>
  );
}
