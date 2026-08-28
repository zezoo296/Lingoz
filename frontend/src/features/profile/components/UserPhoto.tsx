import { useEffect, useState } from "react";
import { RiCameraLine } from "react-icons/ri";

type UserPhotoProps = {
    photo?: string | null;
    name?: string | null;
    selectedPhoto?: File;
    onPhotoChange: (file: File | undefined) => void;
};

export default function UserPhoto({ photo, name, selectedPhoto, onPhotoChange }: UserPhotoProps) {
    const [previewUrl, setPreviewUrl] = useState<string>();

    useEffect(() => {
        if (!selectedPhoto) {
            setPreviewUrl(undefined);
            return;
        }

        const objectUrl = URL.createObjectURL(selectedPhoto);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
    }, [selectedPhoto]);

    const displayedPhoto = previewUrl ?? photo;

    return (
        <aside className="w-full lg:w-64 shrink-0">
            <div className="bg-surface border border-border rounded-xl p-6 flex flex-col items-center">
                <h2 className="text-text-primary font-medium mb-4 self-start text-sm">
                    Profile Photo
                </h2>

                <div className="relative">
                    <div className="w-32 h-32 rounded-full border-2 border-brand-500 overflow-hidden bg-surface-elevated">
                        {displayedPhoto ? (
                            <img
                                src={displayedPhoto}
                                alt={name ?? "Profile"}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-background-secondary text-3xl font-semibold text-text-muted">
                                {name?.[0]?.toUpperCase() ?? "U"}
                            </div>
                        )}
                    </div>
                    <label
                        htmlFor="profile-photo"
                        className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-brand-500 flex items-center justify-center text-white shadow-lg hover:bg-brand-600 transition-colors"
                    >
                        <RiCameraLine className="w-4 h-4" />
                    </label>
                    <input
                        key={selectedPhoto?.name ?? "empty"}
                        id="profile-photo"
                        type="file"
                        accept="image/jpeg,image/png,image/gif"
                        className="sr-only"
                        onChange={(event) =>
                            onPhotoChange(event.target.files?.[0])
                        }
                    />
                </div>

                <p className="text-text-muted text-xs text-center mt-3">
                    JPG, PNG or GIF. Max size of 2MB.
                </p>

                <label
                    htmlFor="profile-photo"
                    className="mt-4 w-full py-2 px-4 rounded-lg border border-brand-500 text-brand-500 text-sm font-medium text-center cursor-pointer hover:bg-brand-500/10 transition-colors"
                >
                    Change Photo
                </label>
            </div>
        </aside>
    );
}
