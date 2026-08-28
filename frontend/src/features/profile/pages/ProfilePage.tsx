import { useEffect, useState, type FormEvent, type ReactNode } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    RiArrowDownSLine,
    RiAtLine,
    RiBuildingLine,
    RiCalendarLine,
    RiGlobalLine,
    RiMailLine,
    RiUserLine,
} from "react-icons/ri";
import type { UserProfile } from "@linguachat/shared";
import { getMe, updateMe, updateUserLanguages as updateUserLanguagesApi } from "../api/user.api";
import { countryOptions } from "../../../lib/nameCode";
import ProfileHeader from "../components/ProfileHeader";
import UserPhoto from "../components/UserPhoto";
import ActionButton from "../components/ActionButton";
import UserLanguages from "../components/UserLanguages";
import toast from "react-hot-toast";

const formatDateForInput = (value: string | null) =>
    value ? value.slice(0, 10) : "";
const inputClassName =
    "w-full bg-background-secondary border border-border rounded-lg py-2.5 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 transition-colors";

type ProfileForm = {
    name: string;
    username: string;
    birthday: string;
    gender: "" | "MALE" | "FEMALE";
    countryCode: string;
    city: string;
};

const toForm = (profile: UserProfile): ProfileForm => ({
    name: profile.name ?? "",
    username: profile.username ?? "",
    birthday: formatDateForInput(profile.birthday),
    gender: profile.gender ?? "",
    countryCode: profile.countryCode ?? "",
    city: profile.city ?? "",
});

export default function ProfilePage() {
    const queryClient = useQueryClient();
    const {
        data: profile,
        isPending,
        isError,
    } = useQuery({
        queryKey: ["current-user-profile"],
        queryFn: getMe,
    });
    const [form, setForm] = useState<ProfileForm | null>(null);
    const [photoFile, setPhotoFile] = useState<File>();

    useEffect(() => {
        if (profile) setForm(toForm(profile));
    }, [profile]);

    const saveProfile = useMutation({
        mutationFn: updateMe,
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(["current-user-profile"], updatedProfile);
            setForm(toForm(updatedProfile));
            setPhotoFile(undefined);
            void queryClient.invalidateQueries({
                queryKey: ["current-user-profile"],
            });
            toast.success("Changes Saved.");
        },
    });

    const saveLanguages = useMutation({
        mutationFn: updateUserLanguagesApi,
        onSuccess: (updatedProfile) => {
            queryClient.setQueryData(["current-user-profile"], updatedProfile);
            toast.success("Languages saved.");
        },
    });

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!form) return;

        const formData = new FormData();
        formData.append("name", form.name);
        formData.append("username", form.username);
        formData.append("birthday", form.birthday);
        formData.append("gender", form.gender);
        formData.append("countryCode", form.countryCode);
        formData.append("city", form.city);
        if (photoFile) formData.append("photo", photoFile);
        saveProfile.mutate(formData);
    };

    const handleReset = () => {
        if (!profile) return;
        setForm(toForm(profile));
        setPhotoFile(undefined);
    };

    const updateField = <K extends keyof ProfileForm>(
        field: K,
        value: ProfileForm[K],
    ) => {
        setForm((current) =>
            current ? { ...current, [field]: value } : current,
        );
    };

    if (isPending)
        return (
            <div className="p-6 text-text-secondary">Loading profile...</div>
        );
    if (isError || !profile || !form) {
        return (
            <div className="p-6 text-text-secondary">
                Unable to load your profile.
            </div>
        );
    }

    return (
        <div className="py-6 px-4 sm:px-6 lg:px-10">
            <div className="max-w-360 mx-auto">
                <ProfileHeader />
                <form
                    className="flex flex-col lg:flex-row gap-6"
                    onSubmit={handleSubmit}
                >
                    <UserPhoto
                        photo={profile.photo}
                        name={profile.name}
                        selectedPhoto={photoFile}
                        onPhotoChange={setPhotoFile}
                    />
                    <main className="flex-1 min-w-0">
                        <div className="bg-surface border border-border rounded-xl p-4 sm:p-6">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                <h2 className="text-text-primary font-medium">
                                    Personal Information
                                </h2>
                                <ActionButton
                                    isSaving={saveProfile.isPending}
                                    onReset={handleReset}
                                />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Field label="Full Name" icon={<RiUserLine />}>
                                    <input
                                        type="text"
                                        value={form.name}
                                        onChange={(e) =>
                                            updateField("name", e.target.value)
                                        }
                                        className={`${inputClassName} pl-10`}
                                    />
                                </Field>
                                <Field
                                    label="Username"
                                    icon={<RiAtLine />}
                                    help="This is your unique username"
                                >
                                    <input
                                        type="text"
                                        value={form.username}
                                        onChange={(e) =>
                                            updateField(
                                                "username",
                                                e.target.value,
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                    />
                                </Field>
                                <Field label="Email" icon={<RiMailLine />}>
                                    <input
                                        type="email"
                                        value={profile.email}
                                        disabled
                                        className={`${inputClassName} pl-10 text-text-muted!`}
                                    />
                                </Field>
                                <Field
                                    label="Birthday"
                                    icon={<RiCalendarLine />}
                                >
                                    <input
                                        type="date"
                                        
                                        value={form.birthday}
                                        onChange={(e) =>
                                            updateField(
                                                "birthday",
                                                e.target.value,
                                            )
                                        }
                                        className={`${inputClassName} pl-10`}
                                    />
                                </Field>
                                <Field label="Gender" icon={<RiUserLine />}>
                                    <select
                                        value={form.gender}
                                        onChange={(e) =>
                                            updateField(
                                                "gender",
                                                e.target
                                                    .value as ProfileForm["gender"],
                                            )
                                        }
                                        className={`${inputClassName} pl-10 appearance-none`}
                                    >
                                        <option value="">Select gender</option>
                                        <option value="MALE">Male</option>
                                        <option value="FEMALE">Female</option>
                                    </select>
                                    <RiArrowDownSLine className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                                </Field>
                                <Field label="Country" icon={<RiGlobalLine />}>
                                    <select
                                        value={form.countryCode}
                                        onChange={(e) =>
                                            updateField(
                                                "countryCode",
                                                e.target.value,
                                            )
                                        }
                                        className={`${inputClassName} pl-10 appearance-none`}
                                    >
                                        <option value="">Select country</option>
                                        {countryOptions.map((country) => (
                                            <option
                                                key={country.code}
                                                value={country.code}
                                            >
                                                {country.name}
                                            </option>
                                        ))}
                                    </select>
                                    <RiArrowDownSLine className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                                </Field>
                                <Field label="City" icon={<RiBuildingLine />}>
                                    <input
                                        type="text"
                                        value={form.city}
                                        onChange={(e) =>
                                            updateField("city", e.target.value)
                                        }
                                        className={`${inputClassName} pl-10`}
                                    />
                                </Field>
                            </div>
                            <UserLanguages
                                userLanguages={profile.userLanguages}
                                isSaving={saveLanguages.isPending}
                                onSave={(userLanguages) =>
                                    saveLanguages.mutate({ userLanguages })
                                }
                            />
                        </div>
                    </main>
                </form>
            </div>
        </div>
    );
}

function Field({
    label,
    icon,
    help,
    children,
}: {
    label: string;
    icon: ReactNode;
    help?: string;
    children: ReactNode;
}) {
    return (
        <div className="space-y-1.5">
            <label className="block text-sm text-text-secondary">{label}</label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none">
                    {icon}
                </span>
                {children}
            </div>
            {help ? <p className="text-xs text-text-muted">{help}</p> : null}
        </div>
    );
}
