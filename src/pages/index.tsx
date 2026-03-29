import { AppToast, AppToastState } from "src/components/AppToast";
import Button from "components/Button";
import DataPreview from "components/DataPreview";
import Modal, { ModalContentPhase } from "components/modal/Modal";
import { NewsletterSignupForm } from "src/components/NewsletterSignupForm";
import { FormDataDTO } from "models/FormDataDTO";
import { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";
import OShape from "images/o_shape.svg";

const emptyPreview: FormDataDTO = {
  email: "",
  clinic: [],
  acceptedTerms: false,
};

const HomePage: NextPage = () => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [formMountKey, setFormMountKey] = useState(0);
  const [previewData, setPreviewData] = useState<FormDataDTO>(emptyPreview);
  const [toast, setToast] = useState<AppToastState | null>(null);
  const [modalContentPhase, setModalContentPhase] =
    useState<ModalContentPhase>("form");
  const showModalButtonRef = useRef<HTMLButtonElement>(null);
  const wasModalOpenRef = useRef(false);

  const dismissToast = useCallback(() => setToast(null), []);

  const handleCloseModal = useCallback(() => {
    setIsModalVisible(false);
    setModalContentPhase("form");
    setFormMountKey((k) => k + 1);
  }, []);

  const handleNewsletterDataReady = useCallback((data: FormDataDTO) => {
    setPreviewData(data);
  }, []);

  const handleNewsletterSuccessFlowComplete = useCallback(() => {
    setToast({
      kind: "success",
      title: "Form submitted successfully",
      body: "Your data has been received. See the preview below.",
    });
    handleCloseModal();
  }, [handleCloseModal]);

  const handleNewsletterSubmitFailed = useCallback((message: string) => {
    setToast({
      kind: "error",
      title: "We could not submit the form",
      body: message,
    });
  }, []);

  useEffect(() => {
    if (wasModalOpenRef.current && !isModalVisible) {
      showModalButtonRef.current?.focus();
    }
    wasModalOpenRef.current = isModalVisible;
  }, [isModalVisible]);

  return (
    <div className="relative flex min-h-[100vh] w-full max-w-full flex-col items-center gap-6 px-4 py-16">
      <div className={"fixed inset-0 -z-20 bg-grey-1000 "}>
        {<OShape className="fixed -top-40 right-10 -z-10" />}
      </div>

      <div className="w-full max-w-[600px]">
        <img
          className="mx-auto mb-[90px] block h-[64px] w-[310px] max-w-full"
          src={"/logo/demant/logo.svg"}
          alt={"Demant logo"}
        />
      </div>
      <DataPreview data={previewData} />

      <div className="flex w-full max-w-[600px] justify-center">
        <Button
          ref={showModalButtonRef}
          className={
            "mt-2 min-w-[240px] px-8 py-3 text-center text-small font-medium text-white transition hover:opacity-95 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-weblink focus-visible:ring-offset-2"
          }
          onClick={() => setIsModalVisible(true)}
          label={"Show modal"}
        />

        <Modal
          isOpen={isModalVisible}
          onClose={handleCloseModal}
          contentPhase={modalContentPhase}
        >
          <NewsletterSignupForm
            key={formMountKey}
            onSuccessDataReady={handleNewsletterDataReady}
            onSuccessFlowComplete={handleNewsletterSuccessFlowComplete}
            onSubmitFailed={handleNewsletterSubmitFailed}
            onModalContentPhaseChange={setModalContentPhase}
          />
        </Modal>
      </div>

      <AppToast toast={toast} onDismiss={dismissToast} />
    </div>
  );
};

export default HomePage;
