
import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import LandingNavigation from "./Navigation";

export default function Landing() {
  return (
    <div>
      <h1>Cheyun Tsao</h1>
      <h2>Section 02</h2>
      <h1>Xueming Tang</h1>
      <h2>Section 01</h2>
      <LandingNavigation />    
    </div>
  );
}