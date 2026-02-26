'use client';
import dynamic from "next/dynamic";

const SignatureMakerClient = dynamic(() => import("./SignatureMakerClient"), {
  ssr: false,
});

export default function SignatureMaker() {
  return <SignatureMakerClient />;
}
