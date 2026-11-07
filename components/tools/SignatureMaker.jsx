'use client';
import dynamic from "next/dynamic";

const SignatureMakerClient = dynamic(() => import("./SignatureMakerClient"));

export default function SignatureMaker() {
  return <SignatureMakerClient />;
}
