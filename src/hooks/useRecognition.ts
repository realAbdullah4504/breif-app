import { useQuery } from "@tanstack/react-query";
import { RecognitionService } from "../services/recognitionService";
import { useAuth } from "../context/AuthContext";

const recognitionService = new RecognitionService();

export const useUserStreak = () => {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ["user-streak", currentUser?.id],
    queryFn: () => recognitionService.getUserStreak(currentUser?.id || ""),
    enabled: !!currentUser?.id,
    select: (response) => response.data,
  });
};

export const useAllUserStreaks = () => {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ["all-user-streaks", currentUser?.id],
    queryFn: () => recognitionService.getAllUserStreaks(currentUser?.id || ""),
    enabled: !!currentUser?.id && currentUser?.role === 'admin',
    select: (response) => response.data,
  });
};

export const useUserAchievements = () => {
  const { currentUser } = useAuth();

  return useQuery({
    queryKey: ["user-achievements", currentUser?.id],
    queryFn: () => recognitionService.getUserAchievements(currentUser?.id || ""),
    enabled: !!currentUser?.id,
    select: (response) => response.data,
  });
};